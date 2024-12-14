// Footer.jsx

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__section">
        <h2 className="footer__logo">
          <h2>RS</h2>
        </h2>
        <h3>Contact details</h3>
        <p>
          Address: Chaurain, Bhelai, Udawantnagr
          <br />
        </p>
        <p>
          Contact us:{" "}
          <a href="mailto:help.pk0158548@gmail.com">help.pk0158548@gmail.com</a>
        </p>
      </div>

      <div className="footer__section">
        <h3>Collection</h3>
        <ul>
          <li>Premium Lehenga, Fashion Dresh, and Salwaar Sut</li>
          <li>Premium Fashion Saree</li>
        </ul>
      </div>

      <div className="footer__section">
        <h3>Connect with us</h3>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social"
        >
          <img
            src="https://img.icons8.com/ios-filled/50/instagram-new.png"
            alt="Instagram"
          />
          Instagram
        </a>
      </div>

      <div className="footer__bottom">
        <div className="footer__payment-icons">
          <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
          <img
            src="https://img.icons8.com/color/48/mastercard.png"
            alt="Mastercard"
          />
          <img src="https://img.icons8.com/color/48/rupay.png" alt="RuPay" />
          <img
            src="https://img.icons8.com/color/48/online-bank.png"
            alt="Net Banking"
          />
          <img src="https://img.icons8.com/color/48/bhim.png" alt="BHIM" />
        </div>
      </div>
      <p style={{ color: "#444", marginTop: "1rem" }}>
        @CopyRight RendomeShop.com
      </p>
    </footer>
  );
};

export default Footer;
