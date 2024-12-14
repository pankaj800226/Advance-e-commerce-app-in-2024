import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { api } from "../Api";
import axios from "axios";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Product {
  _id: string;
  productId: {
    price: number;
  };
  quantity: number;
}

interface Order {
  status: string;
}

interface User {
  username: string;
  profileImg: string;
}

const Home = () => {
  const [productCount, setProductCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [allUsers, setAllUsers] = useState<User[]>([])
  const token = localStorage.getItem("TOKEN");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productResponse = await axios.get<Product[]>(`${api}/productFind`);
        setProductCount(productResponse.data.length);

        // Fetch orders
        const orderResponse = await axios.get<Order[]>(`${api}/allOrder`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderCount(orderResponse.data.length);

        // Calculate total price based on products and quantities
        const calculatedTotalPrice = productResponse.data.reduce(
          (acc, item) => acc + item.productId.price * item.quantity,
          0
        );

        setTotalPrice(calculatedTotalPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);


  // all users
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${api}/allUser`)
        setAllUsers(response.data)
      } catch (error) {
        console.log(error);

      }
    }

    fetchUser();
  }, [])
  const productPieChartData = {
    labels: ["Total Products"],
    datasets: [
      {
        label: "Products",
        data: [productCount],
        backgroundColor: ["#FF6384"],
        hoverBackgroundColor: ["#FF6384"],
      },
    ],
  };

  const totalPricePieChartData = {
    labels: ["Total Price"],
    datasets: [
      {
        label: "Price",
        data: [totalPrice],
        backgroundColor: ["#36A2EB"],
        hoverBackgroundColor: ["#36A2EB"],
      },
    ],
  };

  const orderPieChartData = {
    labels: ["Total Orders"],
    datasets: [
      {
        label: "Orders",
        data: [orderCount],
        backgroundColor: ["#808080"],
        hoverBackgroundColor: ["#808080"],
      },
    ],
  };

  return (
    <div className="dashboard_container">
      <SideBar />
      <main>


        <div className="pie_charts_container">
          <div className="pie_chart_item">
            <h3>Total Products</h3>
            <Pie data={productPieChartData} />
          </div>

          <div className="pie_chart_item">
            <h3>Total Orders</h3>
            <Pie data={orderPieChartData} />
          </div>

          <div className="pie_chart_item">
            <h3>Total Price</h3>
            <Pie data={totalPricePieChartData} />
          </div>
        </div>
        {/* // all user  */}
        <div className="allUser">
          <h3>Total User</h3>

          {
            allUsers.length === 0 ? (
              <h3>User Not Fount</h3>
            ) : (
              allUsers.map((user, index) => (
                <div className="user" key={index}>
                  <img src={`${api}/profileImg/${user.profileImg}`} alt="" />
                  <p>{user.username}</p>

                </div>

              ))
            )
          }
        </div>
      </main>
    </div>
  );
};

export default Home;
