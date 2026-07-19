import {
  createContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({
  children,
}) => {
  const [currentUser, setCurrentUser] =
    useState(() => {
      try {
        const storedUser =
          localStorage.getItem("user");

        if (
          !storedUser ||
          storedUser === "undefined"
        ) {
          return null;
        }

        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    });

  const updateUser = (user) => {
    setCurrentUser(user);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};