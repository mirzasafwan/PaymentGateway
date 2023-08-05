document
  .getElementById("paymentForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;
    // console.log(amount);
    const response = await fetch("/create_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    const options = {
      key: key,
      amount: data.amount,
      currency: "INR",
      name: data.name,
      description: "Test Payment",
      image: "https://example.com/logo.png",
      order_id: data.id,
      handler: function (response) {
        const paymentId = response.razorpay_payment_id;
        const orderId = response.razorpay_order_id;
        const signature = response.razorpay_signature;

        fetch("/verify_payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId, orderId, signature, amount }),
        }).then(function (response) {
          window.location.href = "/success?amount=" + amount;
        });
      },
      prefill: {
        name: name,
        email: email,
        contact: contact,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
