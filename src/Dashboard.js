import { Link } from "react-router-dom";
import ProfileCard from "./components/ProfileCard";
import { BellIcon, BoltIcon, CogIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 🔹 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/bgvid2.mp4" type="video/mp4" />
      </video>
      {/* 🔹 Overlay (Darken Video for Better Readability) */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* 🔹 Main Dashboard Content */}
      <div className="relative z-10 flex flex-col items-center p-6 space-y-6">
        {/* 🔹 Top Icons */}
        <div className="w-full max-w-5xl flex justify-end space-x-4">
          <BellIcon className="w-9 h-9 text-yellow-300 hover:text-yellow-400 cursor-pointer transition-all duration-500 transform hover:scale-125 hover:drop-shadow-[0_0_25px_rgba(255,223,0,0.8)]" />
          <BoltIcon className="w-9 h-9 text-cyan-400 hover:text-cyan-500 cursor-pointer transition-all duration-500 transform hover:scale-125 hover:drop-shadow-[0_0_25px_rgba(0,255,255,0.8)]" />
          <CogIcon className="w-9 h-9 text-purple-400 hover:text-purple-500 cursor-pointer transition-all duration-500 transform hover:scale-125 hover:drop-shadow-[0_0_25px_rgba(255,0,255,0.8)]" />
        </div>

        {/* 🔹 Profile Card */}
        <ProfileCard />

        {/* 🔹 Cards (Maintaining Equal Size) */}
        <div className="flex justify-center gap-6 w-full max-w-5xl">
          {["Lessons", "Daily Quiz", "Homework", "Leaderboard"].map((item) => (
            <Link
              to={item === "Leaderboard" ? "/leaderboard" : "#"}
              key={item}
              className="group relative h-60 w-72 bg-gray-900 rounded-xl shadow-2xl transition-all duration-500 hover:scale-105"
            >
              {/* Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500 rounded-xl transition-all duration-500" />

              {/* Inner Card */}
              <div className="absolute inset-0.5 bg-gray-900 rounded-[11px] flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {item}
                </span>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute -inset-2 opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-r from-cyan-500/50 to-blue-600/50 blur-xl" />
            </Link>
          ))}
        </div>

        {/* 🔹 AI Button (Circular with Hover Effect) */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-1 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-purple-400/40">
            <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI
              </span>
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-purple-400/30 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
