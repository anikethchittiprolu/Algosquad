import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

const Leaderboard = () => {
  const currentUserRank = 4;
  const currentUserRef = useRef(null);

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: "CyberNinja", xp: 4500, avatar: "/user1.jpg" },
    { rank: 2, name: "NeonWarrior", xp: 4200, avatar: "/user2.jpg" },
    { rank: 3, name: "QuantumBaby", xp: 4000, avatar: "/user3.jpg" },
    { rank: 4, name: "Current User", xp: 3950, avatar: "/user4.jpg" },
    { rank: 5, name: "PhantomCoder", xp: 3850, avatar: "/user5.jpg" },
    { rank: 6, name: "GlitchMaster", xp: 3700, avatar: "/user6.jpg" },
  ];

  useEffect(() => {
    if (currentUserRef.current) {
      currentUserRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 group z-10">
        <a
          href="/dashboard"
          className="flex items-center text-teal-300 hover:text-pink-300 transition-all duration-300"
        >
          <ChevronLeftIcon className="w-8 h-8 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xl font-bold drop-shadow-[0_0_8px_rgba(94,234,212,0.6)]">
            Back to Dashboard
          </span>
        </a>
      </div>

      {/* Leaderboard Title */}
      <h1 className="text-5xl font-bold text-center mb-12 mt-8">
        <span className="bg-gradient-to-r from-teal-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
          LEADERBOARD
        </span>
      </h1>

      {/* Leaderboard Entries */}
      <div className="max-w-6xl mx-auto space-y-4 relative">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            ref={user.rank === currentUserRank ? currentUserRef : null}
            className={`group relative bg-gradient-to-r ${user.rank === currentUserRank 
              ? 'from-teal-500/20 via-pink-500/20 to-purple-500/20 border-b-4 border-teal-400 animate-float' 
              : 'from-gray-800/20 to-gray-900/20 hover:from-gray-800/40'} 
              p-6 rounded-xl shadow-2xl transition-all duration-500 hover:scale-[1.02]`}
          >
            {/* Entry Content */}
            <div className="relative flex items-center justify-between z-10">
              {/* Rank & Profile */}
              <div className="flex items-center space-x-6">
                <div className={`relative w-14 h-14 rounded-full p-0.5 ${
                  user.rank === 1 ? 'bg-gradient-to-tr from-yellow-400 via-amber-400 to-orange-400' : 
                  'bg-gradient-to-tr from-teal-400 to-pink-400'
                }`}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                  />
                  {user.rank === 1 && (
                    <div className="absolute -top-2 -right-2 animate-bounce">
                      <span className="text-2xl">👑</span>
                    </div>
                  )}
                </div>
                <div>
                  <span className={`text-2xl font-bold ${
                    user.rank === 1 ? 'text-amber-300' : 'text-teal-300'
                  }`}>
                    #{user.rank}
                  </span>
                  <h2 className={`text-xl font-semibold ${
                    user.rank === currentUserRank 
                      ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]' 
                      : 'text-gray-200'
                  }`}>
                    {user.name}
                  </h2>
                </div>
              </div>

              {/* XP Progress */}
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-pink-400">
                    {user.xp} XP
                  </span>
                  <div className="w-48 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-pink-400 rounded-full transition-all duration-1000"
                      style={{ width: `${(user.xp / 5000) * 100}%` }}
                    />
                  </div>
                </div>
                {user.rank === currentUserRank && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-pink-400 flex items-center justify-center animate-pulse">
                    <span className="text-lg font-bold text-gray-900">YOU</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect */}
            {user.rank !== currentUserRank && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-r from-teal-400/30 to-pink-400/30 rounded-xl" />
            )}
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950/90 to-transparent pointer-events-none" />
    </div>
  );
};

export default Leaderboard;