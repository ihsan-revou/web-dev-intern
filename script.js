document.addEventListener("DOMContentLoaded", () => {
    // Path ke file JSON yang berisi data chat yang diperluas
    const chatDataUrl = "extended_chat_data.json";
    const chatRoomName = document.getElementById("chat-room-name");
    const chatRoomImage = document.getElementById("room-image");
    const chatMessages = document.getElementById("chat-messages");
  
    // Fetch chat data dari file JSON
    fetch(chatDataUrl)
      .then(response => response.json())
      .then(data => {
        const roomData = data.results[0];
  
        // Menampilkan nama chat room
        chatRoomName.textContent = roomData.room.name;
  
        // Menampilkan gambar profil chat room
        chatRoomImage.src = roomData.room.image_url;
  
        // Render pesan dari data chat
        roomData.comments.forEach(comment => {
          const messageElement = document.createElement("div");
          messageElement.classList.add("message", comment.sender.includes("customer") ? "customer" : "agent");
  
          // Menampilkan nama pengirim di atas pesan
          const senderNameElement = document.createElement("div");
          senderNameElement.classList.add("sender-name");
  
          // Cari nama pengirim berdasarkan email
          const sender = roomData.room.participant.find(participant => participant.id === comment.sender);
          senderNameElement.textContent = sender ? sender.name : comment.sender;
  
          messageElement.appendChild(senderNameElement);
  
          // Cek apakah pesan adalah teks biasa atau memiliki attachment
          if (comment.type === "text") {
            messageElement.appendChild(document.createTextNode(comment.message));
          } else if (comment.type === "attachment") {
            // Tangani pesan dengan tipe attachment
            const attachment = comment.attachment;
            const attachmentMessage = document.createElement("div");
            attachmentMessage.textContent = comment.message;
            messageElement.appendChild(attachmentMessage);
  
            if (attachment.type === "image") {
              const img = document.createElement("img");
              img.src = attachment.url;
              img.alt = "image attachment";
              img.style.width = "100%";
              img.style.borderRadius = "8px";
              messageElement.appendChild(img);
            } else if (attachment.type === "video") {
              const video = document.createElement("video");
              video.src = attachment.url;
              video.controls = true;
              video.style.width = "100%";
              messageElement.appendChild(video);
            } else if (attachment.type === "pdf") {
              const link = document.createElement("a");
              link.href = attachment.url;
              link.textContent = "View PDF Document";
              link.target = "_blank";
              link.style.display = "block";
              link.style.color = "#007bff";
              messageElement.appendChild(link);
            }
          }
  
          // Tambahkan pesan ke container chat
          chatMessages.appendChild(messageElement);
        });
      })
      .catch(error => console.error("Error fetching chat data:", error));
  
    // Fitur pengiriman pesan (hanya simulasi dalam contoh ini)
    const messageInput = document.getElementById("message-input");
    const sendMessageButton = document.getElementById("send-message");
  
    sendMessageButton.addEventListener("click", () => {
      const message = messageInput.value.trim();
      if (message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "agent");
        
        // Tampilkan nama pengirim (Agent) di atas pesan
        const senderNameElement = document.createElement("div");
        senderNameElement.classList.add("sender-name");
        senderNameElement.textContent = "Agent A";  // Sesuaikan dengan pengirim yang login
        messageElement.appendChild(senderNameElement);
        
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        messageInput.value = "";
      }
    });
  });
  