import { useState } from "react";
import { loginUser, registerUser } from "./api";

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = isRegister
        ? await registerUser(name, email, password)
        : await loginUser(email, password);

      onAuth(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(isRegister ? "login" : "register");
    setError("");
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <span className="brand-mark">J</span>
          <span>
            JOURNAL<span className="brand-dot">.</span>
          </span>
        </div>

        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-subtitle">
          {isRegister
            ? "Start tracking your job applications."
            : "Log in to see your applications."}
        </p>

        {isRegister && (
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={8}
            required
          />
        </label>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button auth-submit" type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isRegister
            ? "Create account"
            : "Log in"}
        </button>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button type="button" onClick={switchMode}>
            {isRegister ? "Log in" : "Create an account"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;