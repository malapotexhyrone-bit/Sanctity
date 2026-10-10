import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8iTg5K51M21cqGdVsuiSCpMHt4nyIXFM",
  authDomain: "sanctity-9cd57.firebaseapp.com",
  projectId: "sanctity-9cd57",
  storageBucket: "sanctity-9cd57.firebasestorage.app",
  messagingSenderId: "756282010970",
  appId: "1:756282010970:web:9387283c587c6adf6c5763"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const wallRef = collection(db, "posts");

// --- PART 1: SENDER LOGIC (Runs only on involved.html) ---
const btn = document.getElementById('sendBtn');
if (btn) {
    btn.addEventListener('click', async () => {
        const input = document.getElementById('messageInput');
        if (input.value.trim() !== "") {
            await addDoc(wallRef, {
                text: input.value,
                createdAt: serverTimestamp()
            });
            input.value = ""; 
            alert("Posted to the Freedom Wall!");
        }
    });
}

const wallElement = document.getElementById('wall');
if (wallElement) {
    const q = query(wallRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        wallElement.innerHTML = ""; 
        snapshot.forEach((doc) => {
            const post = doc.data();
            const postDiv = document.createElement('div');
            postDiv.style.borderBottom = "1px solid #eee";
            postDiv.style.padding = "10px";
            postDiv.textContent = post.text;
            wallElement.appendChild(postDiv);
        });
    });
}