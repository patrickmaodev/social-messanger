const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const app = express();
const port = 8000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');

mongoose.connect(
    "mongodb+srv://patrickcharlestz:971997Abcdef.@cluster0.plooqwi.mongodb.net/social-messanger",
    {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    }
).then(() => {
    console.log('connected to Mongo DB');
}).catch((err) => {
    console.log('Error while connecting to Mongo DB',err);
});
app.listen(port, () => {
    console.log('Server running on port 8000');
});

const User = require("./models/user");
const Message = require("./models/message");
const FriendRequest = require("./models/friendRequest");

//endpoint for registration of User
app.post('/register',(req,res)=>{
    const {name,email,password,image} = req.body;
    const newUser = new User({ name,email,password,image });
    newUser.save().then(()=>{
        res.status(200).json({'message':'User Registered Successfully'});
    }).catch((err)=>{
        console.log('Error Registered User',err);
        res.status(500).json({'message':'Error Registering User'})
    })
})

// function to create a Token based on user
const createToken = (userId) => {
    //set the token payload
    const payload = {
        userId: userId,
    };
    //generate a token key with secret key and expiration time
    const token = jwt.sign(payload, "Q$r2K6W*n!jCW%Zk", { expiresIn: "1h"});
    return token;
}

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // check if the email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and the password are required" });
    }

    // find the user based on the provided email
    User.findOne({ email })
        .then(user => {
            // check if user exists
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // compare the provided password with the password in the database
            if (user.password !== password) {
                return res.status(401).json({ message: "Invalid Password" });
            }

            // create and send a token
            const token = createToken(user._id);
            res.status(200).json({ token, user: { userId: user._id, name: user.name, email: user.email, image: user.image} });
        })
        .catch(error => {
            console.log("Error in finding the user", error);
            res.status(500).json({ message: "Internal Server Error!" });
        });
});

//endpoint to access all the users except the user who is currently logged in and friends
app.get("/users/:userId", async (req, res) => {
    const loggedInUserId = req.params.userId;
    
    try {
        // Find friend relationships where the current user is involved and the status is 'accepted'
        const friendRequests = await FriendRequest.find({
        $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        status: "accepted",
        });
    
        // Extract friend IDs
        const friendIds = friendRequests.map((request) =>
        request.senderId.toString() === loggedInUserId ? request.receiverId : request.senderId
        );
    
        // Exclude the logged-in user and their friends
        const users = await User.find({
        _id: { $nin: [loggedInUserId, ...friendIds] },
        });
    
        res.json(users);
    } catch (err) {
        console.error("Error retrieving users", err);
        res.status(500).json({ message: "Error retrieving users" });
    }
    });

//endpoint to access all the users except the user who is currently logged in
app.get("/all-users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;
    
    User.find({ _id: { $ne: loggedInUserId } })
        .then((users) => {
        res.json(users);
        })
        .catch((err) => {
        console.log("Error retrieving users", err);
        res.status(500).json({ message: "Error retrieving users" });
        });
    });

app.get('/friends/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const sentRequests = await FriendRequest.find({
            senderId: userId,
            status: 'accepted',
        }).populate('receiverId', 'name email image');

        const receivedRequests = await FriendRequest.find({
            receiverId: userId,
            status: 'accepted',
        }).populate('senderId', 'name email image');

        const friends = [
            ...sentRequests.map((r) => r.receiverId),
            ...receivedRequests.map((r) => r.senderId),
        ];

        const pendingRequests = await FriendRequest.find({
            receiverId: userId,
            status: 'pending',
        }).populate('senderId', 'name email image');

        return res.json({ friends, pendingRequests });
    } catch (error) {
        console.error('Error retrieving friends:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/friend-request', async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        // Check if a friend request already exists
        let request = await FriendRequest.findOne({
            senderId: currentUserId,
            receiverId: selectedUserId,
        });

        if (request) {
            if (request.status === 'pending') {
                return res.status(200).json({ 
                    message: 'Friend request already sent',
                    selectedUserId,
                    requestStatus: 'pending'
                });
            }
            if (request.status === 'accepted') {
                return res.status(200).json({ 
                    message: 'You are already friends',
                    selectedUserId,
                    requestStatus: 'accepted'
                });
            }
        }

        // Create a new friend request
        request = new FriendRequest({
            senderId: currentUserId,
            receiverId: selectedUserId,
            status: 'pending',
        });
        await request.save();

        // Return the updated status
        return res.status(201).json({ 
            message: 'Friend request sent',
            selectedUserId,
            requestStatus: 'pending'
        });

    } catch (error) {
        console.error('Error while sending friend request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


//endpoint to show end point request where the user is the sender
app.get("/requesting-friends-requests/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find friend requests where the user is the sender and the status is 'pending'
        const friendRequests = await FriendRequest.find({
            senderId: userId,
            status:'pending'
        }).populate("receiverId", "name email image");

        // Format the friend requests
        const formattedRequests = friendRequests.map((request) => ({
            requestId: request._id,
            receiverId: request.receiverId._id,
            name: request.receiverId.name,
            email: request.receiverId.email,
            image: request.receiverId.image,
        }));

        res.status(200).json({ friendRequests: formattedRequests });
    } catch (error) {
        console.error("Error retrieving friend requesting requests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/pending-requests/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const friendRequests = await FriendRequest.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
            status: "pending",
        })
        .populate("senderId", "name email image")
        .populate("receiverId", "name email image");

        const formattedRequests = friendRequests.map((request) => ({
            requestId: request._id,
            sender: {
                id: request.senderId._id,
                name: request.senderId.name,
                email: request.senderId.email,
                image: request.senderId.image,
            },
            receiver: {
                id: request.receiverId._id,
                name: request.receiverId.name,
                email: request.receiverId.email,
                image: request.receiverId.image,
            }
        }));

        res.status(200).json({ friendRequests: formattedRequests });
    } catch (error) {
        console.error("Error retrieving friend requests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//endpoint to show end point request where the user is the receiver
app.get("/requested-friends-requests/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("we hitten");

        // Find friend requests where the user is the receiver
        const friendRequests = await FriendRequest.find({
            receiverId: userId,
        }).populate("senderId", "name email image");

        // Format the friend requests
        const formattedRequests = friendRequests.map((request) => ({
            requestId: request._id,
            senderId: request.senderId._id,
            name: request.senderId.name,
            email: request.senderId.email,
            image: request.senderId.image,
            status: request.status
        }));

        res.status(200).json({ friendRequests: formattedRequests });
    } catch (error) {
        console.error("Error retrieving friend requested requests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get("/friend-requests/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find friend requests sent by the current user
        const sentRequests = await FriendRequest.find({
            senderId: userId,
        }).populate("receiverId", "name email image");

        // Find friend requests received by the current user
        const receivedRequests = await FriendRequest.find({
            receiverId: userId,
        }).populate("senderId", "name email image");

        // Format the sent requests
        const formattedSentRequests = sentRequests.map((request) => ({
            requestId: request._id,
            type: "sent",
            receiverId: request.receiverId._id,
            name: request.receiverId.name,
            email: request.receiverId.email,
            image: request.receiverId.image,
            status: request.status,
        }));

        // Format the received requests
        const formattedReceivedRequests = receivedRequests.map((request) => ({
            requestId: request._id,
            type: "received",
            senderId: request.senderId._id,
            name: request.senderId.name,
            email: request.senderId.email,
            image: request.senderId.image,
            status: request.status,
        }));

        res.status(200).json({
            sentRequests: formattedSentRequests,
            receivedRequests: formattedReceivedRequests,
        });
    } catch (error) {
        console.error("Error retrieving friend requests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const multer = require('multer');

//configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        //specify the desired destination folder
        cb(null, 'files/');
    },
    filename: function (req, file, cb){
        //generate unique for the upload file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
}); 

const upload = multer({ Storage: storage});

//endpoint to post Messages and store it in backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
    try{
        const { senderId, recipientId, messageType, messageText } = req.body;
        const newMessage = new Message({
            senderId,
            recipientId,
            messageType,
            message: messageText,
            timestamp: new Date(),
            imageUrl: messageType === "image" ? req.file.path : null,
        });
            
        await newMessage.save();

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
})

//endpoint to get the user details to design the chat header
app.get('/user/:userId', async(req, res) => {
    try{
        const {userId} = req.params;

        //fetch user data from user id
        const recipientId = await User.findById(userId);
        res.json(recipientId)
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
})

//endpoint to fetch the messages between two user in chart-room
app.get("/messages/:senderId/:recipientId", async (req, res) => {
    try {
        const { senderId, recipientId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId, recipientId },
                { senderId: recipientId, recipientId: senderId }
            ],
        })
            .populate("senderId", "_id name email") // Populate senderId with name and email
            .sort({ timestamp: 1 }); // Sort messages by timestamp in ascending order (oldest first)

        // Map the messages to a cleaner format
        const formattedMessages = messages.map(message => {
            return {
                messageId: message._id,
                sender: {
                    id: message.senderId._id,
                    name: message.senderId.name,
                    email: message.senderId.email
                },
                recipientId: message.recipientId,
                messageType: message.messaget, // either 'text' or 'image'
                content: message.message, // text message or URL of the image
                imageUrl: message.imageUrl || null, // Only include image URL if it's an image message
                timestamp: message.timestamp,
            };
        });

        res.status(200).json(formattedMessages); // Return the formatted messages

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//endpoint to  delete the messages
app.post("/deleteMessages/", async(req, res) => {
    try{
        const {messages} = req.body;
        if(!Array.isArray(messages) || messages.length === 0){
            return res.status(400).json({message: "invalid request body!"});
        }

        await Message.deleteMany({_id:{$in:messages}});
        res.json({message: "message deleted successfully"});

    } catch(error){
        res.status.json("Internal Server Error");
    }

});

// Endpoint to fetch the current logged-in user's chats
app.get('/chats/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { recipientId: userId }
            ]
        }).populate('senderId', 'name email image')
        .populate('recipientId', 'name email image')
        .sort({ timestamp: 1 });

        res.status(200).json({ messages });
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Remove friend request
app.post('/cancel-friend-request', async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        const request = await FriendRequest.findOne({
            senderId: currentUserId,
            receiverId: selectedUserId,
            status: 'pending',
        });

        if (!request) {
            return res.status(404).json({ 
                message: 'No pending friend request found to cancel', 
                selectedUserId 
            });
        }

        await FriendRequest.deleteOne({ _id: request._id });

        return res.status(200).json({ 
            message: 'Friend request canceled successfully', 
            selectedUserId 
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Accept friend request
app.post('/accept-friend-request', async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        const request = await FriendRequest.findOne({
            senderId: selectedUserId,
            receiverId: currentUserId,
            status: 'pending',
        });

        if (!request) {
            return res.status(404).json({
                message: 'No pending friend request found to accept',
                selectedUserId
            });
        }

        request.status = 'accepted';
        await request.save();

        return res.status(200).json({
            message: 'Friend request accepted successfully',
            selectedUserId
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove friend
app.post('/remove-friend', async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        const request = await FriendRequest.findOne({
            senderId: selectedUserId,
            receiverId: currentUserId,
            status: 'accepted',
        });

        if (!request) {
            return res.status(404).json({
                message: 'No accepted friend for that option',
                selectedUserId
            });
        }

        request.status = 'pending';
        await request.save();

        return res.status(200).json({
            message: 'Friend removed successfully',
            selectedUserId
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});