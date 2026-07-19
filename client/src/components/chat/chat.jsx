import React, {
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

export const Chat = ({ chats }) => {
  const [chat, setChat] = useState(null);

  const { currentUser } =
    useContext(AuthContext);

  const { socket } =
    useContext(SocketContext);

  const location = useLocation();

  const messageEndRef = useRef(null);

  // STORE UNREAD CHAT IDS
  const unreadChatIds = useRef(new Set());

  const increase = useNotificationStore(
    (state) => state.increase
  );

  const decrease = useNotificationStore(
    (state) => state.decrease
  );

  // LOAD EXISTING UNREAD CHAT IDS
  useEffect(() => {
    if (!chats || !currentUser) return;

    const unreadIds = chats
      .filter(
        (c) =>
          !c.seenBy?.includes(currentUser.id)
      )
      .map((c) => c.id);

    unreadChatIds.current = new Set(
      unreadIds
    );
  }, [chats, currentUser]);

  // AUTO SCROLL TO LATEST MESSAGE
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chat?.messages]);

  // OPEN CHAT FROM PROPERTY PAGE
  useEffect(() => {
    const chatId =
      location.state?.openChatId;

    if (!chatId || !chats?.length) return;

    const targetChat = chats.find(
      (c) => c.id === chatId
    );

    if (targetChat) {
      handleOpenChat(
        targetChat.id,
        targetChat.receiver
      );
    }
  }, [location.state, chats]);

  // OPEN CHAT
  const handleOpenChat = async (
    id,
    receiver
  ) => {
    try {
      const res = await apiRequest(
        "/chats/" + id
      );

      if (
        unreadChatIds.current.has(id)
      ) {
        decrease();

        unreadChatIds.current.delete(id);
      }

      setChat({
        ...res.data,
        receiver,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // SEND MESSAGE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const text =
      e.target.text.value.trim();

    if (!text || !chat) return;

    try {
      const res = await apiRequest.post(
        "/messages/" + chat.id,
        {
          text,
        }
      );

      setChat((prev) => ({
        ...prev,

        messages: [
          ...prev.messages,
          res.data,
        ],
      }));

      e.target.reset();

      socket?.emit("sendMessage", {
        receiverId: chat.receiver.id,

        data: {
          ...res.data,
          chatId: chat.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // RECEIVE MESSAGE
  useEffect(() => {
    if (!socket) return;

    const handleMessage = async (data) => {
      // CURRENT CHAT IS OPEN
      if (
        chat &&
        chat.id === data.chatId
      ) {
        setChat((prev) => ({
          ...prev,

          messages: [
            ...prev.messages,
            data,
          ],
        }));

        try {
          await apiRequest.put(
            "/chats/read/" + chat.id
          );
        } catch (err) {
          console.error(err);
        }

        return;
      }

      // CHECK IF CHAT IS ALREADY UNREAD
      if (
        !unreadChatIds.current.has(
          data.chatId
        )
      ) {
        unreadChatIds.current.add(
          data.chatId
        );

        increase();
      }
    };

    socket.on(
      "getMessage",
      handleMessage
    );

    return () => {
      socket.off(
        "getMessage",
        handleMessage
      );
    };
  }, [socket, chat, increase]);

  return (
    <div
      className={`chat ${
        chat ? "chatOpened" : ""
      }`}
    >
      {/* TITLE */}
      <h1 className="chatTitle">
        Messages
      </h1>

      {/* CHAT LIST */}
      <div className="messages">
        {(!chats ||
          chats.length === 0) && (
          <p className="noChats">
            No chats yet
          </p>
        )}

        {chats?.map((c) => (
          <div
            className={`message ${
              chat?.id === c.id
                ? "active"
                : ""
            }`}
            key={c.id}
            onClick={() =>
              handleOpenChat(
                c.id,
                c.receiver
              )
            }
          >
            <img
              src={
                c.receiver?.avatar ||
                "/noavatar.png"
              }
              alt={`${c.receiver?.username} avatar`}
            />

            <div className="messageInfo">
              <span>
                {c.receiver?.username}
              </span>

              <p>
                {c.lastMessage ||
                  "Start chatting..."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHAT BOX */}
      <div className="chatBox">
        {!chat ? (
          <div className="noChat">
            Select a chat to start messaging
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}
            <div className="top">
              <div className="user">
                <img
                  src={
                    chat.receiver?.avatar ||
                    "/noavatar.png"
                  }
                  alt={`${chat.receiver?.username} avatar`}
                />

                <span>
                  {chat.receiver?.username}
                </span>
              </div>

              <span
                className="close"
                onClick={() =>
                  setChat(null)
                }
              >
                ✕
              </span>
            </div>

            {/* CHAT MESSAGES */}
            <div className="center">
              {chat.messages?.map(
                (message) => (
                  <div
                    key={message.id}
                    className={`chatMessage ${
                      message.userId ===
                      currentUser.id
                        ? "own"
                        : ""
                    }`}
                  >
                    <p>{message.text}</p>

                    <span>
                      {format(
                        message.createdAt
                      )}
                    </span>
                  </div>
                )
              )}

              <div ref={messageEndRef} />
            </div>

            {/* MESSAGE INPUT */}
            <form
              className="bottom"
              onSubmit={handleSubmit}
            >
              <textarea
                name="text"
                placeholder="Type a message..."
                required
              />

              <button type="submit">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};