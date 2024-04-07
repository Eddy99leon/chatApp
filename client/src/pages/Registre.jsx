import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { makeRequest } from "../utils/axios";

const Registre = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const HandelRegistre = () => {
    makeRequest
      .post("/api/auths/register", {
        name: name,
        email: email,
        password: password,
      })
      .then((response) => {
        navigate("/login");
        console.log("Utilisateur créer avec succes:", response.data);
      })
      .catch((error) => {
        console.log("Erreur lors de registre:", error);
      });
    setName("");
    setEmail("");
    setPassword("");
  };


  return (
    <div className="w-full h-[650px] flex items-center justify-center">
      <div className="flex flex-col gap-3 w-[400px]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 text-lg bg-gray-700 border-none outline-none rounded-lg"
          placeholder="Pseudo"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 text-lg bg-gray-700 border-none outline-none rounded-lg"
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 text-lg bg-gray-700 border-none outline-none rounded-lg"
          placeholder="Password"
        />
        <div className="text-gray-400 text-lg">
          Avez déja un compte?{" "}
          <Link to="/login" className="text-white font-bold">
            Se connecter
          </Link>
        </div>
        <button
          onClick={HandelRegistre}
          className="p-3 bg-violet-800 text-black font-bold text-lg rounded-lg"
        >
          S'inscrire
        </button>
      </div>
    </div>
  );
}

export default Registre