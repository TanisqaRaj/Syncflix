const Footer = () => {
  return (
    <section className="bg-[#0D1224] text-white pt-16 pb-10 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Career
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Help</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Delivery Details
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Free eBooks
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Development Tutorial
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  How to – Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  YouTube Playlist
                </a>
              </li>
            </ul>
          </div>

          {/* App Store */}
          <div>
            <div className="space-y-4">
              <a href="#" className="inline-block h-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  height="100%"
                  width="auto"
                  fill="white"
                >
                  <path d="M36.009,5.074H13.991C9.025,5.074,5,9.099,5,14.064V36c0,4.965,4.025,8.991,8.991,8.991h22.019	C40.975,44.99,45,40.965,45,36V14.064C45,9.099,40.975,5.074,36.009,5.074z M16.171,36.755c-0.372,0.636-1.041,0.989-1.728,0.989	c-0.343,0-0.691-0.088-1.009-0.274c-0.953-0.559-1.273-1.784-0.714-2.736l0.291-0.497c0.515-0.162,1.057-0.25,1.614-0.234l0.005,0	c1.023,0.03,1.879,0.493,2.464,1.176L16.171,36.755z M27.413,32H12c-1.104,0-2-0.896-2-2s0.896-2,2-2h4.665l5.866-10.01	l-1.811-3.091c-0.559-0.953-0.239-2.178,0.714-2.737c0.953-0.558,2.178-0.239,2.737,0.714l0.678,1.157l0.678-1.157	c0.558-0.953,1.783-1.272,2.737-0.714c0.953,0.559,1.273,1.784,0.714,2.737L21.301,28h4.18c0.625,0.416,1.162,0.966,1.549,1.64	l0.003,0.004C27.473,30.409,27.57,31.237,27.413,32z M38,32h-2.623l1.602,2.733c0.559,0.952,0.239,2.178-0.714,2.736	c-0.318,0.187-0.666,0.274-1.009,0.274c-0.687,0-1.355-0.354-1.728-0.989l-6.151-10.497c-0.834-1.549-0.803-3.427,0.109-4.943	l0.826-1.373L33.033,28H38c1.104,0,2,0.896,2,2S39.104,32,38,32z" />
                </svg>
              </a>

              {/* Google Play Store */}
              <a href="#" className="inline-block h-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="auto"
                  height="100%"
                  viewBox="0 0 48 48"
                >
                  <linearGradient
                    id="gp1"
                    x1="18.102"
                    x2="25.297"
                    y1="3.244"
                    y2="34.74"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#35ab4a" />
                    <stop offset=".297" stopColor="#31a145" />
                    <stop offset=".798" stopColor="#288739" />
                    <stop offset="1" stopColor="#237a33" />
                  </linearGradient>
                  <path
                    fill="url(#gp1)"
                    d="M13.488,4.012C10.794,2.508,7.605,3.778,6.45,6.323L24.126,24l9.014-9.014L13.488,4.012z"
                  ></path>

                  <linearGradient
                    id="gp2"
                    x1="19.158"
                    x2="21.194"
                    y1="23.862"
                    y2="66.931"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#f14e5d" />
                    <stop offset=".499" stopColor="#ea3d4f" />
                    <stop offset="1" stopColor="#e12138" />
                  </linearGradient>
                  <path
                    fill="url(#gp2)"
                    d="M33.14,33.014L24.126,24L6.45,41.677c1.156,2.546,4.345,3.815,7.038,2.312L33.14,33.014z"
                  ></path>

                  <linearGradient
                    id="gp3"
                    x1="32.943"
                    x2="36.541"
                    y1="14.899"
                    y2="43.612"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#ffd844" />
                    <stop offset=".519" stopColor="#ffc63f" />
                    <stop offset="1" stopColor="#ffb03a" />
                  </linearGradient>
                  <path
                    fill="url(#gp3)"
                    d="M41.419,28.393c1.72-0.96,2.58-2.676,2.581-4.393c-0.001-1.717-0.861-3.434-2.581-4.393l-8.279-4.621L24.126,24l9.014,9.014L41.419,28.393z"
                  ></path>

                  <linearGradient
                    id="gp4"
                    x1="13.853"
                    x2="15.572"
                    y1="5.901"
                    y2="42.811"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".003" stopColor="#0090e6" />
                    <stop offset="1" stopColor="#0065a0" />
                  </linearGradient>
                  <path
                    fill="url(#gp4)"
                    d="M6.45,6.323C6.168,6.948,6,7.652,6,8.408v31.179c0,0.761,0.164,1.463,0.45,2.09l17.674-17.68L6.45,6.323z"
                  ></path>
                </svg>
              </a>
              {/* New Colorful 4-Tile SVG */}
              <a
                href="https://play.google.com/store/games?device=phone"
                className="inline-block h-12 w-12"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-full w-full"
                >
                  <path
                    fill="#ff5722"
                    d="M6 6H22V22H6z"
                    transform="rotate(-180 14 14)"
                  ></path>
                  <path
                    fill="#4caf50"
                    d="M26 6H42V22H26z"
                    transform="rotate(-180 34 14)"
                  ></path>
                  <path
                    fill="#ffc107"
                    d="M26 26H42V42H26z"
                    transform="rotate(-180 34 34)"
                  ></path>
                  <path
                    fill="#03a9f4"
                    d="M6 26H22V42H6z"
                    transform="rotate(-180 14 34)"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© Copyright 2022, All Rights Reserved by ClarityUI</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">
              <i className="fab fa-twitter"></i>🐦
            </a>
            <a href="#" className="hover:text-white">
              <i className="fab fa-facebook"></i>📘
            </a>
            <a href="#" className="hover:text-white">
              <i className="fab fa-instagram"></i>📸
            </a>
            <a href="#" className="hover:text-white">
              <i className="fab fa-github"></i>🐙
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
