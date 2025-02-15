import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProfileCard = () => {
  const xpPercentage = 75;

  return (
    <div className="relative flex items-center bg-gray-900 text-white p-8 rounded-3xl shadow-2xl w-full max-w-5xl border border-gray-700 hover:border-cyan-400 transition-all duration-500 group">
      {/* Profile Image & Name */}
      <div className="relative flex flex-col items-center mr-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-br from-cyan-400 to-purple-500 p-1 shadow-profile-glow">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
            <img src="/default-profile.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        <p className="mt-2 text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent neon-text-glow text-center">
          Student
        </p>
      </div>

      {/* Stats Grid (Lessons, Topics, XP) */}
      <div className="flex-1 grid grid-cols-3 gap-8 pr-8">
        {["Lessons", "Topics", "XP"].map((stat, idx) => (
          <div key={stat} className="text-center">
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent neon-text-glow">
              {idx === 0 ? 10 : idx === 1 ? 10 : 1200}
            </p>
            <p className="text-sm text-gray-400 mt-2">{stat}</p>
          </div>
        ))}
      </div>

      {/* Concentric Rings (Non-Rotating & Glowing) */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer Ring (Pink Glow) */}
        <div className="absolute w-36 h-36 rounded-full border-4 border-pink-500/50 shadow-[0_0_20px_#ff00ff]"></div>

        {/* Middle Ring (Blue Glow) */}
        <div className="absolute w-28 h-28 rounded-full border-4 border-cyan-500/50 shadow-[0_0_20px_#00ffff]"></div>

        {/* Inner Ring (Green Glow) */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-green-500/50 shadow-[0_0_20px_#00ff00]"></div>

        {/* XP Text */}
        <p className="absolute text-white text-2xl font-bold">{xpPercentage}%</p>
      </div>
    </div>
  );
};

export default ProfileCard;
