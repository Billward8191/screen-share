const socket = io();
let peer;
let room;

window.startSharing = async function () {
  room = document.getElementById("room").value;

  if (!room) {
    alert("Enter a code");
    return;
  }

  socket.emit("join-room", room);

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  });

  document.getElementById("video").srcObject = stream;

  peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  stream.getTracks().forEach(track => {
    peer.addTrack(track, stream);
  });

  peer.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", { room, candidate: event.candidate });
    }
  };

  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);

  socket.emit("offer", { room, offer });
};

socket.on("answer", async (answer) => {
  await peer.setRemoteDescription(answer);
});

socket.on("candidate", async (candidate) => {
  await peer.addIceCandidate(candidate);
});