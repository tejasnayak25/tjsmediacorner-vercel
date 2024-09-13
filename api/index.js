let express = require("express");
let app = express();
let path = require("path");
let admin = require("firebase-admin");

let serviceAccount = process.env.SERVICE_ACCOUNT;

if(serviceAccount) {
    serviceAccount = JSON.parse(serviceAccount);
} else {
    serviceAccount = require("./serviceAccount.json");
}

let fapp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
}, 'admin');

let firestore = fapp.firestore();
let auth = fapp.auth();
let users = firestore.collection("users");
let membershipCollection = firestore.collection("memberships");

let memberships = [];
membershipCollection.get().then(data => {
    memberships = data.docs.map(item => ({ id:item.id, data: item.data() }));
});

membershipCollection.onSnapshot((snapshot) => {
    memberships = snapshot.docs.map(item => ({ id:item.id, data: item.data() }));
});

users.onSnapshot((snapshot) => {
    let docs = snapshot.docChanges();
    for (let i = 0; i < docs.length; i++) {
        const document = docs[i];
        if(document.type === "added") {
            if (!document.doc.data().subscriptions) { // Check if the document is new
                users.doc(document.doc.id).update({
                    subscriptions: [],
                    purchased_credits: 50,
                    ad_credits: 0
                });
            }
        }
    }
});

var { Liquid } = require('liquidjs');
var engine = new Liquid({
    root: './views/'
});

// register liquid engine
app.engine('liquid', engine.express()); 
app.set('view engine', 'liquid');

app.use((req, res, next) => {  
    if (req.headers['sec-fetch-dest']) {
        if(req.headers['sec-fetch-dest'] === "service-worker") {
            return next();
        } else {
            if (req.path.endsWith(".css")) {
                if (req.headers['sec-fetch-dest'] === "style") {
                    return next();
                } else {
                    return res.status(404).end();
                }
            } else if (req.path.endsWith(".js")) {
                if (req.headers['sec-fetch-dest'] === "script") {
                    return next();
                } else {
                    return res.status(404).end();
                }
            } else {
                if (req.headers.accept && req.headers.accept.includes("text/html") && req.headers['sec-fetch-dest'] === "document") {
                    return next();
                } else if (req.headers['sec-fetch-site'] === "same-origin") {
                    return next();
                } else {
                    return res.status(404).end();
                }
            }
        }
    } else {
        return next();
    }
});
// console.log()
// app.use(express.json());

app.use(express.static(__dirname));

// Middleware to parse x-www-form-urlencoded payloads
app.use(express.urlencoded({ extended: true }));

app.route("/")
.get((req, res) => {
    res.render("index", { title: "TJ's Media Corner" });
});

app.route("/login")
.get((req, res) => {
    res.render("login", { title: "Login | TJ's Media Corner" });
});

app.route("/signup")
.get((req, res) => {
    res.render("signup", { title: "Signup | TJ's Media Corner" });
});

app.route("/forgot-password")
.get((req, res) => {
    res.render("forgot-password", { title: "Forgot Password | TJ's Media Corner" });
});

app.route("/account")
.get((req, res) => {
    res.render("account", { title: "Account | TJ's Media Corner" });
});

app.route("/about")
.get((req, res) => {
    res.render("about", { title: "About | TJ's Media Corner" });
});

app.route('/api/membership')
.post((req, res) => {
    // Access the JSON data from the request body
    const jsonData = req.body;

    if(req.headers["user-agent"] === "Ruby") {
        // Log the JSON data
        if(memberships.find(item => item.id === jsonData.product_name)) {
            try {
                if(jsonData.resource_name === "sale") {
                    if(jsonData.refunded === "false") {
                        users.doc(jsonData.email).update({
                            subscriptions: admin.firestore.FieldValue.arrayUnion(jsonData.product_name)
                        });
                    }
                } else if(jsonData.resource_name === "cancellation") {
                    if(jsonData.cancelled === "true") {
                        users.doc(jsonData.user_email).update({
                            subscriptions: admin.firestore.FieldValue.arrayRemove(jsonData.product_name)
                        });
                    }
                } else if(jsonData.resource_name === "subscription_ended") {
                    users.doc(jsonData.user_email).update({
                        subscriptions: admin.firestore.FieldValue.arrayRemove(jsonData.product_name)
                    });
                } else if(jsonData.resource_name === "subscription_restarted") {
                    users.doc(jsonData.user_email).update({
                        subscriptions: admin.firestore.FieldValue.arrayUnion(jsonData.product_name)
                    });
                }
            } catch(e) {
                console.log("Error with membership API", e);
            }
        }

        // Send a response back to the client
        res.json({
            message: 'Data received successfully',
            status: 200
        }); 
    } else {
        res.status(404).end();
    }
});

// Generate custom token after user is authenticated
async function generateCustomToken(uid) {
    try {
        const customToken = await auth.createCustomToken(uid);
        return customToken;
    } catch (error) {
        console.error("Error creating custom token:", error);
        throw error;
    }
}

// Endpoint to generate token
app.post('/generateCustomToken', async (req, res) => {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
        // Verify the ID token
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Generate custom token
        const customToken = await generateCustomToken(uid);

        // Respond with the custom token
        res.json({ token: customToken });
    } catch (error) {
        console.error("Error verifying ID token or generating custom token:", error);
        res.status(403).send("Unauthorized");
    }
});

app.route("/help")
.get((req, res) => {
    res.render("help", { title: "Help | TJ's Media Corner" });
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;