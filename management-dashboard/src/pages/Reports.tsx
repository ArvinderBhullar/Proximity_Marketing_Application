import React, { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState("2024-04-01");
  const [endDate, setEndDate] = useState("2024-04-30");
  const [redeemData, setRedeemData] = useState([]);
  const [couponCountDict, setCouponCountDict] = useState({});
  const [topSellingCoupon, setTopSellingCoupon] = useState("");

  useEffect(() => {
    const fetchRedeemData = async () => {
      try {
        const endDatePlusOne = new Date(endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);

        const redeemCollectionRef = collection(db, "Redemptions");
        const q = query(
          redeemCollectionRef,
          where("redeemedAt", ">=", startDate),
          where("redeemedAt", "<=", endDatePlusOne.toISOString())
        );
        const querySnapshot = await getDocs(q);
        const redeemedCoupons = [];
        querySnapshot.forEach((doc) => {
          const redeemDoc = doc.data();
          redeemedCoupons.push({
            id: doc.id,
            userId: redeemDoc.userId,
            couponId: redeemDoc.couponId,
            redeemedAt: new Date(redeemDoc.redeemedAt).toLocaleDateString(),
            name: redeemDoc.couponName,
          });
        });

        const redeemedCouponsPerDay = redeemedCoupons.reduce((acc, curr) => {
          acc[curr.redeemedAt] = (acc[curr.redeemedAt] || 0) + 1;
          return acc;
        }, {});

        const couponCounts = redeemedCoupons.reduce((acc, curr) => {
          acc[curr.name] = (acc[curr.name] || 0) + 1;
          return acc;
        }, {});

        console.log("coupon Counts", couponCounts);
        setCouponCountDict(couponCounts);

        const sortedCouponCounts = Object.entries(couponCounts).sort(
          ([, a], [, b]) => (b as number) - (a as number)
        );

        if (sortedCouponCounts.length > 0) {
          const [topCouponId, count] = sortedCouponCounts[0];
          const couponDocRef = doc(db, "Coupons", topCouponId);
          const couponDocSnapshot = await getDoc(couponDocRef);
          const topCouponName = couponDocSnapshot.exists()
            ? couponDocSnapshot.data().name
            : "Unknown Coupon";
          setTopSellingCoupon(`${topCouponName} (${count} redeemed)`);
        } else {
          setTopSellingCoupon("No coupons redeemed in this period");
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        const currentDate = new Date(startDateObj);
        const redeemDataArray = [];

        while (currentDate <= endDateObj) {
          const formattedDate = currentDate.toLocaleDateString();
          const count = redeemedCouponsPerDay[formattedDate] || 0;
          redeemDataArray.push({ date: formattedDate, count });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setRedeemData(redeemDataArray);
      } catch (error) {
        console.error("Error fetching redemption data:", error);
      }
    };

    if (startDate && endDate) {
      fetchRedeemData();
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  return (
    <Box sx={{ m: 3 }}>
      <h1>Welcome to the Reports Page</h1>
      <p>Please select a date range to see the reports.</p>
      <TextField
        id="start-date"
        label="Start Date"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="end-date"
        label="End Date"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div>
        <h2>Coupons Redeemed Per Day</h2>

        <LineChart
          xAxis={[
            {
              data: redeemData.map((data) => Date.parse(data.date)),
              valueFormatter: (value) => new Date(value).toLocaleDateString(),
            },
          ]}
          series={[
            {
              data: redeemData.map((data) => data.count),
            },
          ]}
          width={window.innerWidth - 100}
          height={window.innerHeight - 200}
        />

        {/* <ul>
          {redeemData.map((data) => (
            <li key={data.date}>
              {data.date}: {data.count}
            </li>
          ))}
        </ul> */}
      </div>
      <div>
        <h2>Coupon Performance</h2>

        <BarChart
          xAxis={[{ scaleType: "band", data: Object.keys(couponCountDict) }]}
          series={[{ data: Object.values(couponCountDict) }]}
          width={window.innerWidth - 100}
          height={window.innerHeight - 200}
        />

        {/* <p>{topSellingCoupon}</p> */}
      </div>
    </Box>
  );
};

export default Reports;
