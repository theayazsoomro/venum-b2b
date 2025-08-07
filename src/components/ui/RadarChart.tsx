"use client";
import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { useCart } from "@/context/CartContext";

// Register necessary components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Define product categories and their characteristics
interface ProductMetrics {
  durability: number;
  warranty: number;
  bulkPrice: number;
  popularity: number;
  maintenance: number;
}

// Component
export default function ProductRadarChart() {
  const { items } = useCart();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Generate product metrics based on product characteristics
  interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    // Add other properties if needed
  }

  const generateProductMetrics = (item: CartItem): ProductMetrics => {
    // Generate metrics based on product name, price, and other factors
    const productName = item.name.toLowerCase();
    const price = item.price;
    const quantity = item.quantity;

    // Base metrics calculation (you can customize this logic)
    let durability = 5; // Default middle value
    let warranty = 3;
    let bulkPrice = 5;
    let popularity = 5;
    let maintenance = 5;

    // Adjust metrics based on product name keywords
    if (
      productName.includes("premium") ||
      productName.includes("pro") ||
      productName.includes("commercial")
    ) {
      durability += 3;
      warranty += 2;
      maintenance += 2;
      bulkPrice -= 1; // Premium products typically more expensive
    }

    if (
      productName.includes("basic") ||
      productName.includes("standard") ||
      productName.includes("entry")
    ) {
      durability -= 1;
      warranty -= 1;
      bulkPrice += 2; // Basic products typically cheaper
      maintenance -= 1;
    }

    if (
      productName.includes("industrial") ||
      productName.includes("heavy-duty")
    ) {
      durability += 4;
      maintenance += 3;
      warranty += 3;
      bulkPrice -= 2;
    }

    // Adjust based on price ranges
    if (price > 1000) {
      durability += 2;
      warranty += 2;
      maintenance += 1;
      bulkPrice -= 1;
    } else if (price < 100) {
      durability -= 1;
      warranty -= 1;
      bulkPrice += 2;
    }

    // Adjust popularity based on quantity (higher quantity might indicate popularity)
    if (quantity > 5) {
      popularity += 2;
    } else if (quantity > 10) {
      popularity += 3;
    }

    // Ensure values are within 1-10 range
    return {
      durability: Math.max(1, Math.min(10, durability)),
      warranty: Math.max(1, Math.min(10, warranty)),
      bulkPrice: Math.max(1, Math.min(10, bulkPrice)),
      popularity: Math.max(1, Math.min(10, popularity)),
      maintenance: Math.max(1, Math.min(10, maintenance)),
    };
  };

  // Generate chart data based on cart items
  const chartData = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        labels: [
          "Durability",
          "Warranty",
          "Bulk Price",
          "Popularity",
          "Maintenance",
        ],
        datasets: [],
      };
    }

    // Color palette for different products
    const colors = [
      { bg: "rgba(255, 99, 132, 0.2)", border: "rgba(255, 99, 132, 1)" },
      { bg: "rgba(54, 162, 235, 0.2)", border: "rgba(54, 162, 235, 1)" },
      { bg: "rgba(255, 205, 86, 0.2)", border: "rgba(255, 205, 86, 1)" },
      { bg: "rgba(75, 192, 192, 0.2)", border: "rgba(75, 192, 192, 1)" },
      { bg: "rgba(153, 102, 255, 0.2)", border: "rgba(153, 102, 255, 1)" },
      { bg: "rgba(255, 159, 64, 0.2)", border: "rgba(255, 159, 64, 1)" },
    ];

    // Filter products to show (either selected ones or first 6)
    const productsToShow =
      selectedProducts.length > 0
        ? items.filter((item) => selectedProducts.includes(item.id))
        : items.slice(0, 6);

    const datasets = productsToShow.map((item, index) => {
      const metrics = generateProductMetrics(item);
      const color = colors[index % colors.length];

      return {
        label: `${item.name} (Qty: ${item.quantity})`,
        data: [
          metrics.durability,
          metrics.warranty,
          metrics.bulkPrice,
          metrics.popularity,
          metrics.maintenance,
        ],
        backgroundColor: color.bg,
        borderColor: color.border,
        pointBackgroundColor: color.border,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: color.border,
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      };
    });

    return {
      labels: [
        "Durability",
        "Warranty",
        "Bulk Price",
        "Popularity",
        "Maintenance",
      ],
      datasets,
    };
  }, [items, selectedProducts]);

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(items.map((item) => item.id));
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Product Comparison Analysis",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        padding: 20,
      },
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (
            context: import("chart.js").TooltipItem<"radar">
          ) {
            const label = context.dataset.label || "";
            const value = context.parsed.r;
            const metricNames = [
              "Durability",
              "Warranty",
              "Bulk Price",
              "Popularity",
              "Maintenance",
            ];
            const metric = metricNames[context.dataIndex];
            return `${label}: ${metric} - ${value}/10`;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 14,
            weight: "bold" as const,
          },
          color: "#374151",
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 10,
          stepSize: 2,
          color: "#6B7280",
          backdropColor: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        radius: 6,
        hoverRadius: 8,
      },
    },
  };

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto my-8 px-4">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Product Comparison Analysis
          </h2>
          <div className="text-center text-gray-500 py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">
              No Products to Analyze
            </h3>
            <p>Add some products to your cart to see the comparison chart.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Product Comparison Analysis
          </h2>
          <p className="text-gray-600">
            Compare key metrics of your selected products
          </p>
        </div>

        {/* Product Selection Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Select Products to Compare (
              {selectedProducts.length > 0
                ? selectedProducts.length
                : items.length}{" "}
              of {items.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={selectAllProducts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Show All
              </button>
            </div>
          </div>

          {/* Product Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedProducts.includes(item.id)
                    ? "border-blue-500 bg-blue-50"
                    : selectedProducts.length === 0
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
                onClick={() => handleProductToggle(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedProducts.includes(item.id) ||
                        selectedProducts.length === 0
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {(selectedProducts.includes(item.id) ||
                        selectedProducts.length === 0) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      ${item.price} × {item.quantity} = $
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-96 lg:h-[500px]">
            <Radar data={chartData} options={options} />
          </div>

          {/* Legend Explanation */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Metrics Explanation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-semibold text-blue-600 mb-1">Durability</h5>
                <p className="text-gray-600">
                  Product longevity and build quality
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-semibold text-green-600 mb-1">Warranty</h5>
                <p className="text-gray-600">
                  Coverage period and support level
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-semibold text-purple-600 mb-1">
                  Bulk Price
                </h5>
                <p className="text-gray-600">
                  Cost-effectiveness for bulk orders
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-semibold text-orange-600 mb-1">
                  Popularity
                </h5>
                <p className="text-gray-600">
                  Market demand and customer preference
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-semibold text-red-600 mb-1">Maintenance</h5>
                <p className="text-gray-600">Ease of maintenance and service</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {items.length}
              </div>
              <div className="text-sm text-blue-800">Total Products</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {selectedProducts.length > 0
                  ? selectedProducts.length
                  : items.length}
              </div>
              <div className="text-sm text-green-800">Compared</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div className="text-sm text-purple-800">Total Units</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                $
                {items
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(0)}
              </div>
              <div className="text-sm text-orange-800">Total Value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
