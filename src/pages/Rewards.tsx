import React from 'react';
import { Award, Star, TrendingUp, Gift, ChevronRight } from 'lucide-react';

export function Rewards() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-primary-dark">Elite Rewards</h1>
        <p className="text-gray-500 mt-1">Earn points and unlock exclusive perks.</p>
      </div>

      <div className="bg-gradient-to-br from-[#1B3B22] to-[#0D1C10] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FCDC04] rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-[#FCDC04] font-bold tracking-widest text-sm mb-2">CURRENT TIER</p>
            <h2 className="text-4xl font-bold mb-2">Platinum Elite</h2>
            <p className="text-gray-300">You are in the top 5% of fleet managers.</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-5xl font-bold text-[#FCDC04] mb-1">12,450</p>
            <p className="text-sm text-gray-300 uppercase tracking-wider">Available Points</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-[#FCDC04]" />
          </div>
          <h3 className="text-lg font-bold text-primary-dark mb-1">Safe Driving Bonus</h3>
          <p className="text-sm text-gray-500 mb-4">Earned 500 points this month for zero speeding incidents.</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-[#FCDC04] h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <p className="text-xs text-right text-gray-400 font-medium">Completed</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-primary-dark mb-1">Eco-Fleet Challenge</h3>
          <p className="text-sm text-gray-500 mb-4">Reduce idle time by 15% to earn 1,000 points.</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-right text-gray-400 font-medium">65% Achieved</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-primary-dark mb-1">Maintenance Master</h3>
          <p className="text-sm text-gray-500 mb-4">Complete all scheduled services on time for 3 months.</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33%' }}></div>
          </div>
          <p className="text-xs text-right text-gray-400 font-medium">Month 1 of 3</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary-dark" />
            Redeem Rewards
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { title: 'Complimentary VIP Detailing', points: 5000, desc: 'Full interior and exterior detailing for one vehicle.' },
            { title: 'Priority Service Booking', points: 2500, desc: 'Skip the queue for your next maintenance appointment.' },
            { title: 'Chauffeur Training Session', points: 10000, desc: 'Advanced defensive driving course for one driver.' },
          ].map((reward, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer group">
              <div>
                <h3 className="font-bold text-primary-dark text-lg group-hover:text-[#4A7C59] transition-colors">{reward.title}</h3>
                <p className="text-sm text-gray-500">{reward.desc}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#FCDC04] bg-yellow-50 px-3 py-1 rounded-lg">{reward.points.toLocaleString()} pts</span>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-dark transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
