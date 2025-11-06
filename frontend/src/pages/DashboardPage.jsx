// import { useState } from 'react';
// import { Shield, AlertTriangle, Check, BarChart2, RefreshCw } from 'lucide-react';
// import { generateMockHistory } from '../utils/mockData';
// import { formatDate } from '../utils/helpers';

// // A simple card component for displaying stats
// const StatCard = ({ title, value, icon }) => (
//   <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
//     <div className="flex items-center justify-between">
//       <p className="text-sm font-medium text-gray-400">{title}</p>
//       <div className="text-violet-400">{icon}</div>
//     </div>
//     <p className="mt-2 text-3xl font-bold text-white">{value}</p>
//   </div>
// );

// const DashboardPage = () => {
//   const [historyItems, setHistoryItems] = useState(generateMockHistory(5));
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Simulates refreshing the activity list
//   const refreshHistory = () => {
//     setIsRefreshing(true);
//     setTimeout(() => {
//       setHistoryItems(generateMockHistory(5));
//       setIsRefreshing(false);
//     }, 700);
//   };

//   // Helper to style the result badge
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'deepfake':
//         return 'bg-red-500/10 text-red-400';
//       case 'authentic':
//         return 'bg-green-500/10 text-green-400';
//       default:
//         return 'bg-yellow-500/10 text-yellow-400';
//     }
//   };

//   return (
//     <div className="bg-gray-900 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 py-12">
        
//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="text-4xl font-bold">
//             Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
//           </h1>
//           <p className="mt-2 text-lg text-white/70">
//             Here's a summary of your recent activity.
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg: 4 gap-6 mb-12">
//           <StatCard title="Total Scans" value="1,284" icon={<Shield size={22} />} />
//           <StatCard title="Deepfakes Found" value="97" icon={<AlertTriangle size={22} />} />
//           <StatCard title="Authentic Files" value="1,123" icon={<Check size={22} />} />
//           <StatCard title="Detection Rate" value="99.7%" icon={<BarChart2 size={22} />} />
//         </div>

//         {/* Recent Activity */}
//         <div>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold">Recent Activity</h2>
//             <button
//               onClick={refreshHistory}
//               disabled={isRefreshing}
//               className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors disabled:opacity-50"
//             >
//               <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
//               {isRefreshing ? 'Refreshing...' : 'Refresh'}
//             </button>
//           </div>
          
//           {/* Activity Table */}
//           <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-gray-800">
//                   <tr>
//                     <th className="px-6 py-3 font-medium text-gray-300">File</th>
//                     <th className="px-6 py-3 font-medium text-gray-300">Date</th>
//                     <th className="px-6 py-3 font-medium text-gray-300">Result</th>
//                     <th className="px-6 py-3 font-medium text-gray-300 text-right">Confidence</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-700">
//                   {historyItems.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-800 transition-colors">
//                       <td className="px-6 py-4 font-medium text-white truncate max-w-xs">{item.fileName}</td>
//                       <td className="px-6 py-4 text-gray-400">{formatDate(item.timestamp)}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClass(item.status)}`}>
//                           {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-gray-300 font-mono text-right">{`${Math.round(item.confidence * 100)}%`}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;