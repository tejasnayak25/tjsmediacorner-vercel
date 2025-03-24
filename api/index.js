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

let memberships = [], new_member;
membershipCollection.get().then(data => {
    memberships = data.docs.map(item => ({ id:item.id, data: item.data() }));
    new_member = memberships.find(item => item.id === "New");
});

membershipCollection.onSnapshot((snapshot) => {
    memberships = snapshot.docs.map(item => ({ id:item.id, data: item.data() }));
    new_member = memberships.find(item => item.id === "New");
});

users.onSnapshot((snapshot) => {
    let docs = snapshot.docChanges();
    for (let i = 0; i < docs.length; i++) {
        const document = docs[i];
        if(document.type === "added") {
            if (!document.doc.data().subscriptions) { // Check if the document is new
                users.doc(document.doc.id).update({
                    subscriptions: ["Free"],
                    tokens: new_member.tokens ?? 100,
                });
            }
        }
    }
});

var { Liquid } = require('liquidjs');
var engine = new Liquid({
    root: path.join(__dirname, '..', 'views')
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

app.route("/membership/monthly-refresh")
.get(async (req, res) => {
    let fapp = null;
    if (admin.apps.length === 0) {
    let serviceAccount = process.env.SERVICE_ACCOUNT;

    if (serviceAccount) {
        try {
            serviceAccount = JSON.parse(serviceAccount);
        } catch (error) {
            console.error('Failed to parse SERVICE_ACCOUNT:', error);
            throw new Error('Invalid SERVICE_ACCOUNT environment variable');
        }
    } else {
        serviceAccount = require("./serviceAccount.json");
    }

    fapp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
        fapp = admin.apps[0];
}

console.log('Apps after initialization:', admin.apps);

    // let fapp=admin.app();
    
    const batch = fapp.firestore().batch();

    firestore = fapp.firestore();
    membershipCollection = firestore.collection("memberships");

    const data = await membershipCollection.get();
memberships = data.docs.map(item => ({ id: item.id, data: item.data() }));
// new_member = memberships.find(item => item.id === "New");

    // console.log(memberships);

    let free_member = memberships.find(item => item.id === "Free").data;
    let admin_member = memberships.find(item => item.id === "Admin").data;

    console.log(admin_member);

    let adminQuery = users.where("subscriptions", "array-contains", "Admin").get()
    .then(docs => {
        docs.forEach(doc => {
            batch.update(doc.ref, {
                tokens: admin_member.tokens,
            });
        });
    });

    let freeQuery = users.where("subscriptions", "array-contains", "Free").get()
    .then(docs => {
        docs.forEach(doc => {
            batch.update(doc.ref, {
                tokens: free_member.tokens,
            });
        });
    });

    await Promise.all([adminQuery, freeQuery]);

        // Commit the batch only after all updates are added
        // await batch.commit();

    batch.commit().then(()=>{
        res.status(200).end();
    })
    .catch((err) => {
        console.error(err);
        res.status(500).end();
    });
});

app.route('/api/gr-client')
.post(async (req, res) => {
    // Access the JSON data from the request body
    let fapp = null;
    if (admin.apps.length === 0) {
        let serviceAccount = process.env.SERVICE_ACCOUNT;

        if (serviceAccount) {
            try {
                serviceAccount = JSON.parse(serviceAccount);
            } catch (error) {
                console.error('Failed to parse SERVICE_ACCOUNT:', error);
                throw new Error('Invalid SERVICE_ACCOUNT environment variable');
            }
        } else {
            serviceAccount = require("./serviceAccount.json");
        }

        fapp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
            fapp = admin.apps[0];
    }

    // let fapp=admin.app();

    firestore = fapp.firestore();
    membershipCollection = firestore.collection("memberships");

    const data = await membershipCollection.get();
    memberships = data.docs.map(item => ({ id: item.id, data: item.data() }));

    const jsonData = req.body;

    if(req.headers["user-agent"] === "Ruby") {
        // Log the JSON data
        let membership = memberships.find(item => item.id === jsonData.product_name);
        let free_member = memberships.find(item => item.id === "Free");
        let primary_member = memberships.filter(item => item.data.type === "primary" && item.id !== "Free");
        primary_member = primary_member.map(item => item.id);

        console.log(jsonData);

        if(membership) {
            membership = membership.data;
            try {
                if(jsonData.resource_name === "sale") {
                    if(jsonData.refunded === "false") {
                        if(membership.type === "primary") {
                            let memData = memberships.find(item => item.id === jsonData.variants.Tier);
                            memData = memData.data;
                            users.doc(jsonData.email).update({
                                subscriptions: admin.firestore.FieldValue.arrayUnion(jsonData.variants.Tier),
                                tokens: memData.tokens,
                            }).then(() => {
                                console.log(memData.related);
                                users.doc(jsonData.email).update({
                                    subscriptions: admin.firestore.FieldValue.arrayRemove("Free", ...memData.related)
                                });
                            });
                        } else {
                            users.doc(jsonData.email).update({
                                subscriptions: admin.firestore.FieldValue.arrayUnion(jsonData.product_name)
                            });
                        }
                    }
                } else if(jsonData.resource_name === "cancellation") {
                    if(jsonData.cancelled === "true") {
                        if(membership.type === "primary") {
                            users.doc(jsonData.user_email).update({
                                subscriptions: admin.firestore.FieldValue.arrayRemove(...membership.tiers)
                            }).then(() => {
                                users.doc(jsonData.email).update({
                                    subscriptions: admin.firestore.FieldValue.arrayUnion("Free")
                                });
                            });
                        } else {
                            users.doc(jsonData.user_email).update({
                                subscriptions: admin.firestore.FieldValue.arrayRemove(jsonData.product_name)
                            });
                        }
                    }
                } else if(jsonData.resource_name === "subscription_ended") {
                    if(membership.type === "primary") {
                        users.doc(jsonData.user_email).update({
                            subscriptions: admin.firestore.FieldValue.arrayRemove(...membership.tiers)
                        }).then(() => {
                            users.doc(jsonData.email).update({
                                subscriptions: admin.firestore.FieldValue.arrayUnion("Free")
                            });
                        });
                    } else {
                        users.doc(jsonData.user_email).update({
                            subscriptions: admin.firestore.FieldValue.arrayRemove(jsonData.product_name)
                        });
                    }
                } else if(jsonData.resource_name === "subscription_restarted") {
                    if(membership.type === "primary") {
                        let memData = memberships.find(item => item.id === (jsonData.variants.tier ?? jsonData.variants.Tier));
                        memData = memData.data;
                        users.doc(jsonData.email).update({
                            subscriptions: admin.firestore.FieldValue.arrayUnion(jsonData.variants.tier ?? jsonData.variants.Tier),
                            tokens: memData.tokens,
                        }).then(() => {
                            users.doc(jsonData.email).update({
                                subscriptions: admin.firestore.FieldValue.arrayRemove("Free", ...memData.related)
                            });
                        });
                    } else {
                        users.doc(jsonData.email).update({
                            subscriptions: admin.firestore.FieldValue.arrayUnion(jsonData.product_name)
                        });
                    }
                } else if(jsonData.resource_name === "subscription_updated") {
                    if(membership.type === "primary") {
                        let memData = memberships.find(item => item.id === jsonData.new_plan.tier);
                        memData = memData.data;
                        users.doc(jsonData.email).update({
                            subscriptions: admin.firestore.FieldValue.arrayUnion(jsonData.new_plan.tier),
                            tokens: memData.tokens,
                        }).then(() => {
                            users.doc(jsonData.email).update({
                                subscriptions: admin.firestore.FieldValue.arrayRemove("Free", jsonData.old_plan.tier, ...memData.related)
                            });
                        });
                    } else {
                        users.doc(jsonData.email).update({
                            subscriptions: admin.firestore.FieldValue.arrayUnion(jsonData.product_name)
                        });
                    }
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
