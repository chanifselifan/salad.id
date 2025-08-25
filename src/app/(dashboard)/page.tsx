"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customerName: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    if (status === "loading") return;

    // For now, we'll check if user is admin (you can implement proper role checking)
    if (!session || session.user?.email !== "test@salad.id") {
      router.push("/");
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      // Mock data for now - replace with real API call
      const mockOrders: Order[] = [
        {
          id: "1",
          orderNumber: "SALAD-001",
          status: "PENDING",
          totalAmount: 75000,
          createdAt: "2025-01-20T10:00:00Z",
          customerName: "John Doe",
        },
        {
          id: "2",
          orderNumber: "SALAD-002",
          status: "COMPLETED",
          totalAmount: 120000,
          createdAt: "2025-01-19T15:30:00Z",
          customerName: "Jane Smith",
        },
      ];

      setOrders(mockOrders);

      // Calculate stats
      setStats({
        totalOrders: mockOrders.length,
        totalRevenue: mockOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        ),
        pendingOrders: mockOrders.filter(
          (order) => order.status === "PENDING"
        ).length,
        completedOrders: mockOrders.filter(
          (order) => order.status === "COMPLETED"
        ).length,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-purple-100 text-purple-800";
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-grey flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-dark-grey-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-grey">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-deep-teal">
            Dashboard Admin
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lime-green hover:text-deep-teal">
              Lihat Website
            </Link>
            <span className="text-dark-grey-text">
              Hi, {session?.user?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-sm text-dark-grey-text mb-2">Total Pesanan</h3>
            <p className="text-3xl font-bold text-deep-teal">
              {stats.totalOrders}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-sm text-dark-grey-text mb-2">Total Pendapatan</h3>
            <p className="text-3xl font-bold text-lime-green">
              Rp {stats.totalRevenue.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-sm text-dark-grey-text mb-2">Pesanan Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-sm text-dark-grey-text mb-2">Pesanan Selesai</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.completedOrders}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-soft-grey">
            <h2 className="text-xl font-bold text-deep-teal">
              Pesanan Terbaru
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-soft-grey">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey-text uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey-text uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey-text uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey-text uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-grey-text uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-grey">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-soft-grey">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-deep-teal">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark-grey-text">
                          {order.customerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-dark-grey-text">
                          Rp {order.totalAmount.toLocaleString("id-ID")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark-grey-text">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-dark-grey-text"
                    >
                      Belum ada pesanan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
