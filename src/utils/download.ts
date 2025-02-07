import { jsPDF } from "jspdf";

export const downloadChat = () => {
  const chatElement = document.querySelector(".chat-container") as HTMLElement;
  if (!chatElement) return;
  const chatInput = chatElement.querySelector(".chat-input");
  const quickReplies = chatElement.querySelector(".quick-replies");
  if (chatInput) {
    chatInput.classList.add("hidden");
  }
  if (quickReplies) {
    quickReplies.classList.add("hidden");
  }

  const doc = new jsPDF();

  doc.setFillColor(146, 30, 20);
  doc.rect(0, 0, doc.internal.pageSize.width, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("Vardaga Assistant Chat History", 105, 15, { align: "center" });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  const elementHTML = chatElement.innerHTML;

  doc.html(elementHTML, {
    callback: function (doc) {
      if (chatInput) {
        chatInput.classList.remove("hidden");
      }
      if (quickReplies) {
        quickReplies.classList.remove("hidden");
      }
      doc.save("chat-history.pdf");
    },
    x: 8,
    y: 25,
    width: 200,
    windowWidth: 800,
  });
};
