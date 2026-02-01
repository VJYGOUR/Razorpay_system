import razorpay from "../razorpay.js";
export const ensureRazorpayCustomer = async (user) => {
  if (user.razorpayCustomerId) return user.razorpayCustomerId;

  const customer = await razorpay.customers.create({
    name: user.name,
    email: user.email,
  });

  user.razorpayCustomerId = customer.id;
  await user.save();

  return customer.id;
};
