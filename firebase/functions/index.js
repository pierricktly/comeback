const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
admin.firestore().settings({ignoreUndefinedProperties: true});
const db = admin.firestore();

// User \\

exports.createUser = functions.https.onCall((data, context) => {
  functions.logger.info("createUser", {structuredData: true});
  return db.collection("users").doc(data.id).set({
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    id: data.id,
    name: data.name,
    picture: "https://firebasestorage.googleapis.com/v0/b/comeback-65643.appspot.com/o/images%2Fartists.jpg?alt=media&token=23be3721-5157-45a7-8c0e-e1c03c2e1827",
    email: data.email,
    role: "NONE",
    subscription: "REGULAR",
    country: null,
  })
      .then((ref) => {
        return {success: true, id: ref.id, message: "User created"};
      })
      .catch((err) => {
        return {success: false, id: "", message: err};
      });
});

exports.readUser = functions.https.onCall((data, context) => {
  functions.logger.info("readUser", {structuredData: true});
  return db.collection("users").doc(data.id).get()
      .then((doc) => {
        return {success: true, data: doc.data()};
      })
      .catch((err) => {
        return {success: false, data: {}, message: err};
      });
});

exports.updateUser = functions.https.onCall((data, context) => {
  functions.logger.info("updateUser", {structuredData: true});
  const user = data;
  user["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();
  return db.collection("artists").doc(user.id).update(user)
      .then((ref) => {
        return {success: true, id: ref.id, message: "updated successfully."};
      })
      .catch((err) => {
        return {success: false, id: "", message: err};
      });
});

exports.deleteUser = functions.https.onCall((data, context) => {
  functions.logger.info("deleteUser", {structuredData: true});
  return db.collection("users").doc(data.id).delete()
      .then((ref) => { 
        return {success: true, res: "User deleted", message: "User deleted"};
      })
      .catch((err) => {
        return {success: false, res: "User not deleted", message: err};
      });
});

// Artists \\

// Create a new artist
exports.createArtist = functions.https.onCall((data, context) => {
  functions.logger.info("createArtist", {structuredData: true});
  return db.collection("artists").add({
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    name: data.name,
    image: data.image,
    type: data.type,
    verified: data.verified,
    description: data.description,
    socials: data.socials,
    platforms: data.platforms,
    idYoutubeMusic: data.idYoutubeMusic,
    styles: data.styles,
    addedBy: data.addedBy,
  })
      .then((ref) => {
        return {success: true, id: ref.id, message: "Artist created"};
      })
      .catch((err) => {
        return {success: false, id: "", message: err};
      });
});

// Get all artists list
exports.getArtist = functions.https.onCall((data, context) => {
  functions.logger.info("getArtist", {structuredData: true});
  return db.collection("artists").where("verified", "==", true).get()
      .then((snapshot) => {
        const artists = [];
        snapshot.forEach((doc) => {
          artists.push(doc.data());
        });
        return {success: true, artists: artists};
      }).catch((err) => {
        return {success: false, artists: []};
      });
});

// Get artist by id
exports.getArtistById = functions.https.onCall((data, context) => {
  functions.logger.info("getArtistById", {structuredData: true});
  return db.collection("artists").doc(data.id).get()
      .then((doc) => {
        return {success: true, artist: doc.data()};
      }).catch((err) => {
        return {success: false, artist: null};
      });
});

// Update artist
exports.updateArtistById = functions.https.onCall((data, context) => {
  functions.logger.info("updateArtistById", {structuredData: true});
  const artist = data;
  artist["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();
  return db.collection("artists").doc(artist.id).update(artist)
      .then((ref) => {
        return {success: true, artist: ref, message: "updated successfully."};
      })
      .catch((err) => {
        return {success: false, artist: "", message: err};
      });
});

// Delete artist
exports.deleteArtist = functions.https.onCall((data, context) => {
  functions.logger.info("deleteArtist", {structuredData: true});
  return db.collection("artists").doc(data.id).delete()
      .then((ref) => { 
        return {success: true, res: "Artist deleted", message: "Artist deleted"};
      })
      .catch((err) => {
        return {success: false, res: "Artist not deleted", message: err};
      });
});

// Add follower to artist
exports.addFollowerArtist = functions.https.onCall((data, context) => {
  functions.logger.info("addFollowerArtist", {structuredData: true});
  const user = data.user;
  return db.collection("artists").doc(data.id).collection("followers").doc(user.id).set(user)
      .then((ref) => {
        return {success: true, added: true, message: "Follow added"};
      })
      .catch((err) => {
        return {success: false, added: false, message: err};
      });
});

// Delete follower to artist
exports.deleteFollowerArtist = functions.https.onCall((data, context) => {
  functions.logger.info("deleteFollowerArtist", {structuredData: true});
  const user = data.user;
  return db.collection("artists").doc(data.id).collection("followers").doc(user.id).delete()
      .then((ref) => { 
        return {success: true, res: "follower deleted", message: "follower deleted"};
      })
      .catch((err) => {
        return {success: false, res: "follower not delete", message: err};
      });
});

// Verified if user follow artist
exports.getFollowerArtistExisted = functions.https.onCall((data, context) => {
  functions.logger.info("getFollowerArtistExisted", {structuredData: true});
  return db.collection("artists").doc(data.id).collection("followers")
  .where("id", "==", data.user).get()
      .then((ref) => {
        return {success: true, added: true, message: "Follower existed"};
      })
      .catch((err) => {
        return {success: false, added: false, message: err};
      });
});

// Get all followers from artist
exports.getFollowersArtist = functions.https.onCall(async (data, context) => {
  functions.logger.info("getFollowersArtist", {structuredData: true});
  const result = await db.collection("artists").doc(data.id).collection("followers").get();
  const followers = [];
  result.forEach((doc) => {
    followers.push(doc.data());
  });
  return {success: true, followers: followers};
});

// Add group to artist
exports.addGroupsArtist = functions.https.onCall((data, context) => {
  functions.logger.info("addGroupsArtist", {structuredData: true});
  const group = data.group;
  return db.collection("artists").doc(data.id).collection("groups").doc(group.id).set(group)
      .then((ref) => {
        return {success: true, added: true, message: "groups added"};
      })
      .catch((err) => {
        return {success: false, added: false, message: err};
      });
});

// Get all group to artist
exports.getGroupsArtist = functions.https.onCall(async (data, context) => {
  functions.logger.info("getGroupsArtist", {structuredData: true});
  const result = await db.collection("artists").doc(data.id).collection("groups").get();
  const groups = [];
  result.forEach((doc) => {
    groups.push(doc.data());
  });
  return groups;
});

// Delete group to artist
exports.deleteGroupsArtist = functions.https.onCall((data, context) => {
  functions.logger.info("deleteGroupsArtist", {structuredData: true});
  const group = data.group;
  return db.collection("artists").doc(data.id).collection("groups").doc(group.id).delete()
      .then((ref) => { 
        return {success: true, res: "groups deleted", message: "groups deleted"};
      })
      .catch((err) => {
        return {success: false, res: "groups not delete", message: err};
      });
});

// Add members to artist
exports.addMembersArtist = functions.https.onCall((data, context) => {
  functions.logger.info("addMembersArtist", {structuredData: true});
  const member = data.member;
  return db.collection("artists").doc(data.id).collection("members").doc(member.id).set(member)
      .then((ref) => {
        return {success: true, added: true, message: "members added"};
      })
      .catch((err) => {
        return {success: false, added: false, message: err};
      });
});

// Get all members from artist
exports.getMembersArtist = functions.https.onCall(async (data, context) => {
  functions.logger.info("getMembersArtist", {structuredData: true});
  const result = await db.collection("artists").doc(data.id).collection("members").get();
  const members = [];
  result.forEach((doc) => {
    members.push(doc.data());
  });
  return members;
});

// Delete members to artist
exports.deleteMembersArtist = functions.https.onCall((data, context) => {
  functions.logger.info("deleteMembersArtist", {structuredData: true});
  const member = data.member;
  return db.collection("artists").doc(data.id).collection("members").doc(member.id).delete()
      .then((ref) => { 
        return {success: true, res: "members deleted", message: "members deleted"};
      })
      .catch((err) => {
        return {success: false, res: "members not delete", message: err};
      });
});

// Pending \\

exports.createPendingUpdateArtist = functions.https.onCall((data, context) => {
  functions.logger.info("createPendingUpdateArtist", {structuredData: true});
  return db.collection("updateArtistPending").doc(data.id).set(data)
      .then((ref) => {
        return {success: true, artist: ref, message: "updated successfully."};
      })
      .catch((err) => {
        return {success: false, artist: "", message: err};
      });
});

exports.getPendingUpdateArtist = functions.https.onCall((data, context) => {
  functions.logger.info("getPendingUpdateArtist", {structuredData: true});
  return db.collection("updateArtistPending").get()
      .then((snapshot) => {
        const artists = [];
        snapshot.forEach((doc) => {
          artists.push(doc.data());
        });
        return {success: true, artists: artists};
      }).catch((err) => {
        return {success: false, artists: []};
      });
});

exports.getPendingCreateArtist = functions.https.onCall((data, context) => {
  functions.logger.info("getPendingCreateArtist", {structuredData: true});
  return db.collection("artists").where("verified", "==", false).get()
      .then((snapshot) => {
        const artists = [];
        snapshot.forEach((doc) => {
          artists.push(doc.data());
        });
        return {success: true, artists: artists};
      }).catch((err) => {
        return {success: false, artists: []};
      });
});

// Styles \\

exports.getStyles = functions.https.onCall((data, context) => {
  functions.logger.info("getStyles", {structuredData: true});
  return db.collection("general").doc("data").get()
      .then((snapshot) => {
        return {success: true, styles: snapshot.data().styles};
      }).catch((err) => {
        return {success: false, styles: []};
      });
});

exports.updateListStyle = functions.https.onCall((data, context) => {
  functions.logger.info("updateListStyle", {structuredData: true});
  return db.collection("general").doc("data").set({
    styles: data.styles,
  })
      .then((ref) => {
        return {success: true, id: ref.id, message: "Styles list updated"};
      })
      .catch((err) => {
        return {success: false, id: "", message: err};
      });
});

// Releases \\

exports.createRelease = functions.https.onCall((data, context) => {
  functions.logger.info("createRelease", {structuredData: true});
  return db.collection("releases").add({
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    name: data.name,
    image: data.image,
    type: data.type,
    releaseDate: data.releaseDate,
    platforms: data.platforms,
    idSpotify: data.idSpotify,
    idYoutubeMusic: data.idYoutubeMusic,
    artists: data.artists,
    styles: data.styles,
    musics: data.musics,
    followers: [],
  })
      .then((ref) => {
        return {success: true, id: ref.id, message: "Release created"};
      })
      .catch((err) => {
        return {success: false, id: "", message: err};
      });
});

exports.updateRelease = functions.https.onCall((data, context) => {
  functions.logger.info("updateRelease", {structuredData: true});
  const release = data;
  release["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();
  return db.collection("releases").doc(data.id).update(release)
      .then((ref) => {
        return {success: true, id: ref.id, message: "updated successfully."};
      })
      .catch((err) => {
        return {success: false, id: "", message: err};
      });
});

// News \\

exports.createNews = functions.https.onCall((data, context) => {
  functions.logger.info("createNews", {structuredData: true});
  return db.collection("news").add({
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    message: data.message,
    date: data.date,
    verified: data.verified,
    source: data.source,
    user: data.user,
    artists: data.artists,
  })
      .then((ref) => {
        return {success: true, id: ref.id, message: "News created"};
      })
      .catch((err) => {
        return {success: false, id: "", message: err};
      });
});

exports.updateNews = functions.https.onCall((data, context) => {
  functions.logger.info("updateNews", {structuredData: true});
  const news = data;
  news["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();
  return db.collection("news").doc(data.id).update(news)
      .then((ref) => {
        return {success: true, id: ref.id, message: "updated successfully."};
      })
      .catch((err) => {
        return {success: false, id: "", message: err};
      });
});
