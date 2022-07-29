import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useUserManagementHook } from "../hooks/userManagementHook";
import { useRouter } from "next/dist/client/router";
import NavBar from "../components/HomePage/NavBar/NavBar";
import MobileNavBar from "../components/HomePage/NavBar/MobileNavBar";
import CarouselLayout from "../components/Carousel/CarouselLayout";
import TestimonialLayout from "../components/Testimonial/TestimonialLayout";
import ArticleCarouselLayout from "../components/ArticlesCarousel/ArticleCarouselLayout";
import Footer from "../components/Footer";
import ModalLayout from "../components/HomePage/ModalLayout";
import { usePostHttp } from "../hooks/postHttp";
import { providers, useSession } from "next-auth/client";
import { DoLogin, UserLogout } from "../redux/actions/UserAction";

export default function Home(props) {
  const [validTokenLoading, validToken] = usePostHttp(null, '/auth/validate');

  useUserManagementHook();

  const dispatch = useDispatch();

  const [session, loading] = useSession();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const user = useSelector((state) => state.UserReducer);
  const router = useRouter();

  const { code, signup, forgotpassword } = router.query;

  const [toLogin, setToLogin] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [toSubmit, setToSubmit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [authLoginLoading, authData] = usePostHttp(
    !user.isLogin && session && toLogin
      ? { name: session.user.name, email: session.user.email }
      : null,
    toLogin ? "/login/auth" : null
  );

  const [requestLoading, requestData] = usePostHttp(
    toSubmit ? { name: name, email: email, message: message } : null,
    toSubmit ? "/request/demo" : null
  );

  const [screenLoading, screenData] = usePostHttp(
    width && height ? { width, height } : "",
    "/screen"
  );

  useEffect(() => {
    if (window.screen.width) setWidth(window.screen.width);
    if (window.screen.height) setHeight(window.screen.height);
  }, []);

  useEffect(() => {
    if(validToken && !validToken.success)
      dispatch(UserLogout(false))
  },[validToken])

  useEffect(() => {
    if (session) {
      setToLogin(true);
    }
  }, [session]);

  useEffect(() => {
    if (authData.success) {
      setLoginModalOpen(false);
      dispatch(DoLogin(true, authData.result));
    }
  }, [authData]);

  useEffect(() => {
    if (code) setLoginModalOpen(true);
  }, [code]);

  useEffect(() => {
    if (signup) setLoginModalOpen(true);
  }, [signup]);

  useEffect(() => {
    if (user.isLogin && user.data && !user.data.verified)
      setLoginModalOpen(true);
  }, [user]);

  function funcContactUs(){
    var givenName = document.getElementById('givName').value;
    var givenEmail = document.getElementById('givEmail').value;
    var givenMessage = document.getElementById('givMessage').value;
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (givenName == ""){
      alert("Please input name");
    }
    if (!givenEmail.match(emailRegex)||givenEmail == ""){
      if (givenEmail == ""){
        alert("Please input E-mail");
      }
      else{
        alert("Invalid Email. Please input a valid E-mail");
      }
    }
    if (givenMessage==""){
      alert("Please input message");
    }
    if (givenEmail.match(emailRegex) && givenName !="" && givenMessage != ""){
      setToSubmit(true);
    }
  }

  useEffect(() => {
    if (requestData) {
      setToSubmit(false);
      setName("");
      setEmail("");
      setMessage("");
      alert("Our representative will contact you soon. Thank you.");
    }
  }, [requestData]);

  useEffect(() => {
    if (forgotpassword) setLoginModalOpen(true);
  }, [forgotpassword]);

  return (
 <>
      <Head>
        <title>Stock Knowledge</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {loginModalOpen && (
        <ModalLayout
          providers={props.providers}
          signup={signup}
          code={code}
          forgotpassword={forgotpassword}
          showModal={setLoginModalOpen}
        />
      )}
      <MobileNavBar showModal={setLoginModalOpen} />
      <NavBar showModal={setLoginModalOpen} />
      <div id="home" className="sm:w-screen xs:w-screen">
        <div className="flex lg:flex-row reno:flex-row md:flex-row sm:flex-col xs:flex-col xxs:flex-col reno:w-full md:w-full sm:w-screen xs:w-screen xxs:w-screen h-1/2 xs:mt-0 xxs:mt-0">
          <div className="lg:w-1/2 md:w-1/2 reno:w-1/2 sm:w-screen xs:w-screen xxs:w-screen lg:pl-14 lg:pt-10 md:pl-10 md:pt-10 reno:pl-10 reno:pt-10 sm:pl-10 xs:pl-10 sm:pt-10 xs:pt-10 xxs:pt-10">
            <h1 className="lg:text-8xl font-bold text-heading md:text-6xl reno:text-6xl sm:text-5xl xs:text-5xl xxs:text-5xl">
              Empowering
              teachers and
              learners in the
              21st century.
            </h1>
            <br />
            <h2 className="xl:text-3xl lg:text-2xl md:text-lg text-subheading md:leading-snug">
              Stock Knowledge brings innovation and education<br />
              together to provide affordable and accessible<br />
              experiential learning technology that students love.<br />
            </h2>
            <br />
            <br />
            <Link href="/#contactus">
              <a className="rounded-full bg-skBlue font-bold xl:text-xl lg:text-xl reno:text-xl md:text-md sm:text-xl xs:text-xl xxs:text-xl text-white py-4 px-12">
                REQUEST A DEMO
              </a>
            </Link>
          </div>
          <div className="xl:w-1/2 lg:w-1/2 md:w-1/2 reno:w-1/2 sm:w-full xs:w-full xxs:w-full md:mt-0 xs:mt-10 xxs:mt-10">
            <img
              className="md:w-full reno:w-full sm:w-full xs:w-full"
              src="/images/mainpage-art2.png"
            />
          </div>
        </div>
      </div>
      {/* <NavBar showModal={setLoginModalOpen} loginModalOpen={loginModalOpen} page={"home"}/> */}
      <br />
      <div className="lg:w-full reno:w-full md:w-full sm:w-screen xs:w-screen xxs:w-screen p-6 h-1/4">
        <h1
          id="solution"
          className="text-center lg:w-full md:w-full reno:w-full sm:w-full xs:w-full xxs:w-full lg:text-6xl reno:text-6xl md:text-6xl sm:text-4xl xs:text-4xl xxs:text-4xl font-semibold text-heading"
        >
          Our Solutions
        </h1>
        <br />
        <h4 className="text-lg text-center text-subheading lg:w-1/3 reno:w-1/3 md:w-1/3 sm:w-full xs:w-full xxs:w-full m-auto">
          Our solutions aim to fulfill the needs of next generation learners in
          the country and across the globe
        </h4>
        <br />
        <div className="w-full flex items-center justify-center">
          <Link href="/solutions">
            <a className="text-center rounded-full bg-skBlue font-bold xl:text-xl lg:text-xl reno:text-xl md:text-md sm:text-xl xs:text-xl xxs:text-xl text-white py-4 px-12">
              LEARN MORE ABOUT OUR OFFER
            </a>
          </Link>
        </div>
        <br />
      </div>
      <div className="md:w-full xs:w-screen xxs:w-screen md:flex-row xs:flex-col xxs:flex-col p-6 h-1/4 flex items-center">
        <div className="md:w-1/2 flex justify-end px-14 transform hover:bg-white transition duration-500 hover:scale-105">
          <img src="images/fullyimmersive.svg" />
        </div>
        <div className="md:w-1/2 px-14 md:text-left xs:text-center xxs:text-center">
          <h4 className="text-4xl font-bold text-blue-500">
            Fully-Immersive Digital Experience
          </h4>
          <p className="text-xl">
            Enabling students to interact and immerse their learning experience
            in their own digital space
          </p>
        </div>
      </div>
      <div className="md:w-full xs:w-screen xxs:w-screen md:flex-row xs:flex-col-reverse xxs:flex-col-reverse p-6 h-1/4 flex items-center">
        <div className="md:w-1/2 px-14 md:text-right xs:text-center xxs:text-center">
          <h4 className="text-4xl font-bold text-blue-500">Gamification</h4>
          <p className="text-xl">
            Assimilating new information and testing new knowledge in a fun and
            engaging way
          </p>
        </div>
        <div className="md:w-1/2 px-14 transform hover:bg-white transition duration-500 hover:scale-105">
          <img src="images/gamification.svg" />
        </div>
      </div>
      <div className="md:w-full md:flex-row xs:w-screen xxs:w-screen xs:flex-col xxs:flex-col p-6 h-1/4 flex items-center">
        <div className="md:w-1/2 flex justify-end px-14 transform hover:bg-white transition duration-500 hover:scale-105">
          <img src="images/device.svg" />
        </div>
        <div className="md:w-1/2 px-14 md:text-left xs:text-center xxs:text-center">
          <h4 className="text-4xl font-bold text-blue-500">
            Device Accessibility
          </h4>
          <p className="text-xl">
            Delivering the highest-quality learning experiences accessible by
            basic devices
          </p>
        </div>
      </div>
      <div className="md:w-full xs:w-screen xxs:w-screen md:flex-row xs:flex-col-reverse xxs:flex-col-reverse p-6 h-1/4 flex items-center">
        <div className="md:w-1/2 px-14 md:text-right xs:text-center xxs:text-center">
          <h4 className="text-4xl font-bold text-blue-500">
            Adaptive Learning
          </h4>
          <p className="text-xl">
            Using algorithms to deliver customized learning activities that
            address each student’s unique needs
          </p>
        </div>
        <div className="md:w-1/2 px-14 transform hover:bg-white transition duration-500 hover:scale-105">
          <img src="images/adaptive.svg" />
        </div>
      </div>
      <div
        className="md:w-full md:flex-row sm:w-screen xs:w-screen xxs:w-screen lg:h-1/4 md:h-1/4 xs:h-auto xxs:h-auto reno:h-1/4 flex mt-32 lg:flex-row md:flex-col reno:flex-col sm:flex-col xs:flex-col xxs:flex-col"
        style={{
          background:
            "url('images/bg-cta-1.svg') rgba(24, 79, 136, 0.5) no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <div
          id="story"
          className="lg:w-1/2 text-white md:p-20 sm:p-20 md:w-full reno:w-full sm:w-screen xs:w-screen xxs:w-screen xs:px-10 xxs:px-10 xs:py-8 xxs:py-8"
        >
          <h4 className="text-center lg:w-full md:w-full reno:w-full sm:w-full xs:w-full xxs:w-full lg:text-6xl reno:text-6xl md:text-6xl sm:text-4xl xs:text-4xl xxs:text-4xl font-bold md:text-4xl">
            Our Story
          </h4>
          <br />
          <br />
          <p className="lg:text-2xl text-justify md:text-lg xs:text-base xxs:text-base">
            Educator and physicist Anna Marie Benzon launched Stock Knowledge to
            focus on how young learners could foster better appreciation for
            their school subjects after realizing that traditional methods were
            not as engaging anymore in the age of the internet.
            <br />
            <br />
            Keeping on track to its mission of instituting its innovative
            platform into the local academic sector, Stock Knowledge recently
            entered into agreements with the Department of Education (DEpEd) of
            Manila and Makati to gather more insights from students and further
            develop the platform’s viability into the education mainstream with
            the help of investors and venture capitalists around the world.
            <br />
            <br />
            Still in its early stages, Stock Knowledge has marked its reputation
            as one of the Philippines’ premier educational technology
            corporations that is committed to making a real difference in the
            industry for the benefit of students and educators around the world.
          </p>
        </div>
        <div className="lg:w-1/2 relative space-y-10 md:p-20 reno:p-20 lg:p-20 sm:p-6 xs:p-6 xxs:p-6 md:w-full reno:w-full sm:w-screen xs:w-screen xxs:w-screen">
          <div className="py-2 px-4 w-full border text-subheading bg-white rounded-lg lg:h-36 md:h-36 reno:h-36 sm:h-auto transform hover:bg-white transition duration-500 hover:scale-105">
            <h6 className="text-2xl font-bold text-blue-400">Mission</h6>
            <br />
            <p>
              Empower learners and educators by creating accessible,
              cutting-edge digital tools.
            </p>
          </div>
          <div className="py-2 px-4 w-full border text-subheading bg-white rounded-lg lg:h-36 md:h-36 reno:h-36 sm:h-auto transform hover:bg-white transition duration-500 hover:scale-105">
            <h6 className="text-2xl font-bold text-blue-400">Vision</h6>
            <br />
            <p>
              Be the leading EdTech company in today's digital transformation
              age.
            </p>
          </div>
          <div className="py-2 px-4 w-full border text-subheading bg-white rounded-lg lg:h-36 md:h-36 reno:h-36 sm:h-auto transform hover:bg-white transition duration-500 hover:scale-105">
            <h6 className="text-2xl font-bold text-blue-400">Core Values</h6>
            <br />
            <p>
              We are a mission-driven team that takes pride in efficient and
              ethical work, anchored on the highest degree of Excellence,
              Efficiency, Integrity, Creativity, and Loyalty.
            </p>
          </div>
        </div>
      </div>
      <div
        id="team"
        className="md:w-full xs:w-screen xxs:w-screen p-6 h-1/4 bg-blue-50 rounded-b-full"
      >
        <h1 className="text-center w-full lg:text-6xl md:text-6xl reno:text-6xl sm:text-4xl xs:text-4xl xxs:text-4xl font-semibold text-heading lg:mt-32 md:mt-32 reno:mt-32 lg:mt-16 lg:mt-16">
          Our Team
        </h1>
        <br />
        <h4 className="lg:text-lg md:text-lg lg:text-lg xs:text-base xxs:text-base text-center text-subheading w-3/4 m-auto">
          Behind the team are empowered individuals comprising scientists,
          engineers, educators, and entrepreneurs who were meticulously selected
          to perform and align with the Corporation’s mission, vision, values
          and culture. Each member of Stock Knowledge possesses the initiative
          to focus on the needs and best interests of its clients, while
          collectively working to ensure that each facet of the learning
          programs is delivered efficiently from conceptualization to
          realization, paving the way to better education for all.
        </h4>
        <CarouselLayout />
        <br />
      </div>
      <div
        id="testimonial"
        className="lg:w-full md:w-full reno:w-full sm:w-screen xs:w-screen xxs:w-screen space-y-14 lg:mt-32 md:mt-32 reno:mt-32 lg:mt-16 lg:mt-16"
      >
        <h1 className="text-center w-full lg:text-6xl md:text-6xl reno:text-6xl sm:text-4xl xs:text-4xl xxs:text-4xl font-semibold text-heading lg:mt-32 md:mt-32 reno:mt-32 lg:mt-16 lg:mt-16">
          From Our Partners
        </h1>
        <TestimonialLayout />
      </div>
      <div className="lg:w-full md:w-full reno:w-full sm:w-screen xs:w-screen xxs:w-screen lg:items-center reno:items-start md:items-start sm:items-start xs:items-start xxs:items-start flex bg-blue-100 lg:mt-32 md:mt-32 reno:mt-32 sm:mt-16 xs:mt-16 xxs:mt-16 p-4 lg:flex-row reno:flex-col md:flex-col sm:flex-col xs:flex-col xxs:flex-col">
        <h6
          id="partners"
          className="lg:text-left lg:w-auto xs:w-full lg:text-6xl reno:text-6xl md:text-6xl sm:text-4xl xs:text-4xl xxs:text-4xl font-semibold text-heading p-10"
        >
          <span className="reno:block lg:hidden">Our Partners</span>
          <span className="lg:block reno:hidden md:hidden sm:hidden xs:hidden xxs:hidden">
            Our
            <br />
            Partners
          </span>
        </h6>
        <div className="lg:w-3/4 reno:w-full md:w-full sm:w-full xs:w-full xxs:w-full lg:px-0 md:px-20 reno:px-52 flex justify-around flex-wrap lg:pb-0 reno:pb-10 md:pb-10 sm:pb-10 xs:pb-10 xxs:pb-10">
          <img className="ml-10 mr-4 w-40 transform hover:bg-transparent transition duration-500 hover:scale-105" src="/images/unicef.svg" />
          <img className="mr-4 transform hover:bg-transparent transition duration-500 hover:scale-105" src="/images/QBO.svg" />
          <img className="ml-4 mr-8 transform hover:bg-transparent transition duration-500 hover:scale-105" src="/images/AIM.svg" />
          <img className="w-24 mr-2 transform hover:bg-transparent transition duration-500 hover:scale-105" src="/images/deped-manila.svg" />
          <img className="w-24 ml-4 transform hover:bg-transparent transition duration-500 hover:scale-105" src="/images/deped-makati.svg" />
          <img className="w-24 ml-6 transform hover:bg-transparent transition duration-500 hover:scale-105" src="/images/aws_logo.svg" />
        </div>
      </div>
      <div
        id="articles"
        className="lg:w-full md:w-full reno:w-full sm:w-screen xs:w-screen xxs:w-screen"
      >
        <div className="text-center lg:w-full md:w-full reno:w-full sm:w-screen xs:w-sceen xxs:w-screen lg:text-6xl md:text-6xl reno:text-6xl sm:text-4xl xs:text-4xl xxs:text-4xl font-semibold text-heading lg:mt-32 md:mt-32 reno:mt-32 sm:mt-16 xs:mt-16 xxs:mt-16 mb-16">
          Media Mention
          <div className="relative top-11 w-full text-xl flex lg:items-center justify-center space-x-8">
            <div className="rounded-lg h-72 w-96 shadow-2xl transform hover:bg-transparent transition duration-500 hover:scale-105">
              <a href="https://mb.com.ph/2021/05/09/local-edtech-startup-finally-seeing-the-light-of-day-via-government-support-amid-covid-19/"
              target="_blank">
                  <img src="images/manila-bulletin.png"/>
              </a>
              <a href="https://mb.com.ph/2021/05/09/local-edtech-startup-finally-seeing-the-light-of-day-via-government-support-amid-covid-19/"
              className="hover:text-skBlue text-sm"
              target="_blank">
                Local EdTech startup Finally Seeing the Light of Day via
                Government Support Amid COVID-19
              </a>
            </div>
            <div className="rounded-lg h-72 w-96 shadow-2xl transform hover:bg-transparent transition duration-500 hover:scale-105">
              <a href="https://newsbytes.ph/2021/05/12/ph-startup-pilots-gamified-edtech-platform-in-deped-makati-manila/?fbclid=IwAR2FNwyzni-Mp4FLjZ19hhqq9tyoqj8-QUP2rDv85GhLjCFpZdUg7bQezrM"
              target="_blank">
                  <img src="images/newsbytes.png"/>
              </a>
              <a href="https://newsbytes.ph/2021/05/12/ph-startup-pilots-gamified-edtech-platform-in-deped-makati-manila/?fbclid=IwAR2FNwyzni-Mp4FLjZ19hhqq9tyoqj8-QUP2rDv85GhLjCFpZdUg7bQezrM"
              className="hover:text-skBlue text-sm"
              target="_blank">
                PH startup pilots ‘gamified’ edtech platform in DepEd Makati, Manila
              </a>
            </div>
            <div className="rounded-lg h-72 w-96 shadow-2xl transform hover:bg-transparent transition duration-500 hover:scale-105">
              <a href="https://businessmirror.com.ph/2021/06/26/stock-knowledge-deped-makati-join-forces-to-launch-edtech-platform/"
              target="_blank">
                  <img src="images/business_mirror.png"/>
              </a>
              <a href="https://businessmirror.com.ph/2021/06/26/stock-knowledge-deped-makati-join-forces-to-launch-edtech-platform/"
              className="hover:text-skBlue text-sm"
              target="_blank">
                Stock Knowledge, DepEd Makati join forces to launch EdTech platform
              </a>
            </div>
          </div>
        </div>
        <br />
        <br />
        <ArticleCarouselLayout />
      </div>
      <div
        id="contactus"
        className="md:w-full reno:w-full lg:w-full sm:w-screen xs:w-screen xxs:w-screen p-6 h-1/4 bg-blue-50 rounded-b-full"
      >
        <h1 className="text-center w-full text-6xl font-semibold text-heading mt-16">
          Send us a message
        </h1>
        <br />
        <h4 className="text-lg text-center text-subheading w-3/4 m-auto">
          Send us a message if you’re interested to partner with us!
        </h4>
        <div className="flex w-full lg:flex-row md:flex-col reno:flex-col sm:flex-col xs:flex-col xxs:flex-col lg:space-y-0 md:space-y-10 reno:space-y-10 sm:space-y-10 xs:space-y-10 xxs:space-y-10 xs:items-center xxs:items-center md:justify-around my-16 px-10">
          <div className="lg:w-2/5 md:w-full reno:w-full sm:w-full xs:w-full xxs:w-full self-start 1080:px-20">
            <div className="space-y-4">
              <div>
                <label className="text-lg font-bold text-subheading">
                  Name:
                </label>
                <input
                  id="givName"
                  name="givName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-subheading"
                  type="text"
                  placeholder="Ex. Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="text-lg font-bold text-subheading">
                  Email:
                </label>
                <input
                  id="givEmail"
                  name="givEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-subheading"
                  type="text"
                  placeholder="something@website.com"
                />
              </div>
              <div>
                <label className="text-lg font-bold text-subheading">
                  Message:
                </label>
                <br />
                <textarea
                  id="givMessage"
                  name="givMessage"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-subheading"
                ></textarea>
              </div>
              <input
                onClick={() => {
                  funcContactUs();
                }}
                className="w-full h-10 bg-blue-500 rounded-full text-white uppercase"
                type="submit"
                value={toSubmit ? "Sending your request..." : "Send a message"}
              />
            </div>
          </div>
          <div className="lg:w-2/5 md:w-full reno:w-full xs:w-full xxs:w-full md:space-y-5 reno:space-y-5 sm:space-y-5 xs:space-y-5 xxs:space-y-5 self-start 1080:px-20">
            <div className="flex items-center text-blue-500">
              <svg
                className="lg:h-4 lg:w-4 md:h-6 md:w-6 reno:h-6 sm:h-6 xs:h-6 xxs:w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <p className="text-subheading">(+63)917 523 0927</p>
            </div>

            <div className="flex items-center text-blue-500 space-x-2">
              <svg
                className="lg:h-4 lg:w-4 md:h-6 md:w-6 reno:h-6 sm:h-6 xs:h-6 xxs:w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <a
                href="mailto:stock.knowledge7@gmail.com "
                className="text-skBlue lg:text-sm md:text-sm reno:text-sm sm:text-sm xs:text-sm xxs:text-sm"
              >
                stock.knowledge7@gmail.com, info@stockknowledge.org
              </a>
            </div>

            <div className="flex items-center text-blue-500 space-x-2">
              <svg
                className="lg:h-4 lg:w-4 md:h-6 md:w-6 reno:h-6 sm:h-6 xs:h-6 xxs:w-6 self-start"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <a className="text-subheading w-11/12 self-start">
                QBO Innovation Hub, Ground Floor, DTI International Building,
                375 Sen. Gil J. Puyat Avenue., Makati City, Metro Manila, 1209
                Philippines
              </a>
            </div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15446.701697972365!2d121.0300123!3d14.5605444!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x929312216d6fcc29!2sQBO%20Innovation%20Hub!5e0!3m2!1sen!2sph!4v1615723123451!5m2!1sen!2sph"
              width="100%"
              height="450"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>

  );
}

export async function getServerSideProps(context) {
  return { props: { providers: await providers(context) } };
}
