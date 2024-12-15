import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFileExcel } from "react-icons/fa6";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { format, isDate, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import * as XLSX from 'xlsx';


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

const AdminPage = () => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [foodCount, setFoodCount] = useState(0);
    const [roomCount, setRoomCount] = useState(0);
    const [tourCount, setTourCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [orderStats, setOrderStats] = useState({});
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [orders, setOrders] = useState([]);
    const [timePeriod, setTimePeriod] = useState('day');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [customTimePeriod, setCustomTimePeriod] = useState(false);


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

     const calculateStats = (orders, period, start, end) => {
        const stats = {};
        let filteredRevenue = 0;
        let filteredOrderCount = 0;

        orders.forEach(order => {
            let date;
            if (order.createdAt instanceof Timestamp) {
                date = order.createdAt.toDate();
            } else {
                console.warn("Invalid date for order:", order);
                return;
            }

            // Filter logic
            if (period === 'custom') {
                if (start && end && isDate(start) && isDate(end)) {
                    if (date < start || date > end) {
                        return;
                    }
                } else {
                    return; 
                }
            }

            let key;
            if (period === 'custom' && start && end && isDate(start) && isDate(end)) {
                key = format(date, 'dd/MM/yyyy', { locale: vi }); // Format ngày kiểu Việt
            } else if (period === 'year') {
                 key = date.getFullYear();
              } else if (period === 'week') {
                  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                 const days = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
                 const weekNumber = Math.ceil((days + 1) / 7);
                 key = `${date.getFullYear()}-W${weekNumber}`;
              } else if (period === 'month') {
                key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            }
              else if (period === 'day'){
                 key = format(date, 'dd/MM/yyyy', { locale: vi }); // Format ngày kiểu Việt
               }
            if (!stats[key]) {
                stats[key] = { count: 0, revenue: 0 };
            }
            stats[key].count += 1;
            stats[key].revenue += order.totalPrice;
            filteredOrderCount++;
            filteredRevenue += order.totalPrice;
        });

        return { stats, filteredRevenue, filteredOrderCount };
    };

      const exportToExcel = () => {
          const dataForExport = sortedOrderStats.map(key => ({
              ThờiGian: key,
              'Số Đơn Hàng': orderStats[key].count,
              DoanhThu: orderStats[key].revenue,
          }));

         const ws = XLSX.utils.json_to_sheet(dataForExport);
         const wb = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(wb, ws, 'Thống kê đơn hàng');
         XLSX.writeFile(wb, `thong_ke_don_hang_${timePeriod}.xlsx`);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [foodSnapshot, roomSnapshot, tourSnapshot, userSnapshot, orderSnapshot] = await Promise.all([
                    getDocs(collection(db, 'foods')),
                    getDocs(collection(db, 'rooms')),
                    getDocs(collection(db, 'tours')),
                    getDocs(collection(db, 'users')),
                    getDocs(collection(db, 'orders'))
                ]);

                setFoodCount(foodSnapshot.size);
                setRoomCount(roomSnapshot.size);
                setTourCount(tourSnapshot.size);
                setUserCount(userSnapshot.size);

                const orderData = orderSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setOrders(orderData);

                let calculatedStats;
                 if (timePeriod === 'custom' && startDate && endDate) {
                      setCustomTimePeriod(true);
                     calculatedStats = calculateStats(orderData, timePeriod, startDate, endDate);
                  } else {
                      setCustomTimePeriod(false);
                      calculatedStats = calculateStats(orderData, timePeriod);
                   }
                  setOrderStats(calculatedStats.stats);
                setTotalRevenue(calculatedStats.filteredRevenue);
                setTotalOrders(calculatedStats.filteredOrderCount);

            } catch (error) {
                console.error("Error fetching data from Firestore: ", error);
            }
        };

        fetchData();
    }, [timePeriod, startDate, endDate]);

    // Sắp xếp orderStats theo ngày
    const sortedOrderStats = Object.keys(orderStats).sort((a, b) => {
      if(timePeriod === 'year' || timePeriod === 'week' || timePeriod === 'month') {
          return a - b;
      }
      const dateA = parse(a, 'dd/MM/yyyy', new Date(), { locale: vi });
      const dateB = parse(b, 'dd/MM/yyyy', new Date(), { locale: vi });
      return dateA - dateB;
    });

    const orderChartData = {
      labels: sortedOrderStats,
        datasets: [
            {
                label: 'Số đơn hàng',
                data: sortedOrderStats.map(key => orderStats[key].count),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            }
        ]
    };

    const revenueChartData = {
       labels: sortedOrderStats,
        datasets: [
            {
                label: 'Doanh thu',
                data: sortedOrderStats.map(key => orderStats[key].revenue),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
            },
        },
    };

    const chartContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
    };

    const chartWrapperStyle = {
        width: '100%',
        height: '300px',
    };


    return (
        <div className="flex">
            <main className="flex-1">
                <header className="mb-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold uppercase">
                        Hệ thống quản lý khu nghĩ dưỡng Mrs. Hang Farm
                    </h1>
                </header>

                <div className="bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="text-sm font-bold uppercase">Tổng Số Phòng</h3>
                            <p className="text-xl">{roomCount}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="text-sm font-bold uppercase">Tổng Số Tour</h3>
                            <p className="text-xl">{tourCount}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h3 className="text-sm font-bold uppercase">Tổng Số Món Ăn</h3>
                            <p className="text-xl">{foodCount}</p>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg uppercase">
                            <h3 className="text-sm font-bold">Tổng Số Người Dùng</h3>
                            <p className="text-xl">{userCount}</p>
                        </div>
                    </div>

                   
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="text-sm font-bold uppercase">Tổng Doanh Thu</h3>
                            <p className="text-xl">{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="text-sm font-bold uppercase">Tổng Đơn Hàng</h3>
                            <p className="text-xl">{totalOrders}</p>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center mt-3">
                        <label className="mr-2">Chọn Thời Gian: </label>
                        <select
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            className="p-2 border rounded mr-4"
                        >
                            <option value="day">Theo Ngày</option>
                            <option value="week">Theo Tuần</option>
                            <option value="month">Theo Tháng</option>
                            <option value="year">Theo Năm</option>
                            <option value="custom">Tùy chọn</option>
                        </select>

                        {timePeriod === 'custom' && (
                            <>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText="Ngày bắt đầu"
                                    className="p-2 border rounded mr-2"
                                    locale={vi}
                                    dateFormat="dd/MM/yyyy"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    placeholderText="Ngày kết thúc"
                                    className="p-2 border rounded"
                                    locale={vi}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </>
                        )}
                         <button
                       
                            onClick={exportToExcel}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2 flex p-10"
                           >Xuất Excel</button>
                    </div>
                    <div className="mb-1 mt-1" style={chartContainerStyle}>
                        <div style={chartWrapperStyle}>
                            <h3 className="text-lg font-bold mb-1">Biểu đồ số đơn hàng</h3>
                             <Bar data={orderChartData} options={{
                                ...chartOptions, plugins: {
                                    title: {
                                        display: true,
                                        text: 'Thống kê số đơn hàng',
                                    },
                                 },
                                }} />
                        </div>
                       <div style={chartWrapperStyle}>
                          <h3 className="text-lg font-bold mb-1">Biểu đồ doanh thu</h3>
                            <Bar data={revenueChartData} options={{
                              ...chartOptions, plugins: {
                                 title: {
                                      display: true,
                                    text: 'Thống kê doanh thu',
                                 },
                             },
                            }} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;