import { useState } from "react";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "./api";

function getResetTokenFromUrl() {
  return new URLSearchParams(window.location.search).get("resetToken") || "";
}

function AuthPage({ onAuth }) {
  const [resetToken] = useState(getResetTokenFromUrl);
  const [mode, setMode] = useState(resetToken ? "reset" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  const titles = {
    login: "Welcome back",
    register: "Create your account",
    forgot: "Forgot your password?",
    reset: "Choose a new password",
  };

  const subtitles = {
    login: "Log in to see your applications.",
    register: "Start tracking your job applications.",
    forgot: "Enter your email and we will send you a reset link.",
    reset: "Enter a new password for your account.",
  };

  const buttonLabels = {
    login: "Log in",
    register: "Create account",
    forgot: "Send reset link",
    reset: "Save new password",
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      if (isForgot) {
        const result = await requestPasswordReset(email);
        setNotice(result.message);
      } else if (isReset) {
        const result = await resetPassword(resetToken, password);
        window.history.replaceState({}, "", window.location.pathname);
        setPassword("");
        setMode("login");
        setNotice(result.message);
      } else {
        const result = isRegister
          ? await registerUser(name, email, password)
          : await loginUser(email, password);

        onAuth(result);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function goTo(nextMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
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

        <h1>{titles[mode]}</h1>
        <p className="auth-subtitle">{subtitles[mode]}</p>

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

        {!isReset && (
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
        )}

        {!isForgot && (
          <label>
            {isReset ? "New password" : "Password"}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete={
                isRegister || isReset ? "new-password" : "current-password"
              }
              minLength={8}
              required
            />
          </label>
        )}

        {mode === "login" && (
          <button
            type="button"
            className="auth-forgot"
            onClick={() => goTo("forgot")}
          >
            Forgot password?
          </button>
        )}

        {notice && (
          <p className="auth-notice" role="status">
            {notice}
          </p>
        )}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="primary-button auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Please wait..." : buttonLabels[mode]}
        </button>

        <p className="auth-switch">
          {mode === "login" && (
            <>
              New here?{" "}
              <button type="button" onClick={() => goTo("register")}>
                Create an account
              </button>
            </>
          )}
          {mode === "register" && (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => goTo("login")}>
                Log in
              </button>
            </>
          )}
          {(isForgot || isReset) && (
            <button type="button" onClick={() => goTo("login")}>
              Back to log in
            </button>
          )}
        </p>
      </form>
    </div>
  );
}

export default AuthPage;