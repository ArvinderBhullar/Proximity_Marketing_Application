import React, { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

const Reports: React.FC = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [redeemData, setRedeemData] = useState([]);
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
                    });
                });

                const redeemedCouponsPerDay = redeemedCoupons.reduce((acc, curr) => {
                    acc[curr.redeemedAt] = (acc[curr.redeemedAt] || 0) + 1;
                    return acc;
                }, {});

                const couponCounts = redeemedCoupons.reduce((acc, curr) => {
                    acc[curr.couponId] = (acc[curr.couponId] || 0) + 1;
                    return acc;
                }, {});

                const sortedCouponCounts = Object.entries(couponCounts)
                    .sort(([, a], [, b]) => (b as number) - (a as number));

                if (sortedCouponCounts.length > 0) {
                    const [topCouponId, count] = sortedCouponCounts[0];
                    const couponDocRef = doc(db, "Coupons", topCouponId);
                    const couponDocSnapshot = await getDoc(couponDocRef);
                    const topCouponName = couponDocSnapshot.exists() ? couponDocSnapshot.data().name : "Unknown Coupon";
                    setTopSellingCoupon(`${topCouponName} (${count} redeemed)`);
                } else {
                    setTopSellingCoupon("No coupons redeemed in this period");
                }

                setRedeemData(sortedCouponCounts);

                const redeemDataArray = Object.keys(redeemedCouponsPerDay).map(
                    (date) => ({
                        date,
                        count: redeemedCouponsPerDay[date],
                    })
                );

                setRedeemData(redeemDataArray);
            } catch (error) {
                console.error("Error fetching redemption data:", error);
            }
        };

        if (startDate && endDate) {
            fetchRedeemData();
        }
    }, [startDate, endDate]);

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
    };

    return (
        <Box sx={{m: 3}}>
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
                <ul>
                    {redeemData.map((data) => (
                        <li key={data.date}>
                            {data.date}: {data.count}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Top Selling Coupon</h2>
                <p>{topSellingCoupon}</p>
            </div>
        </Box>
    );
};

export default Reports;
