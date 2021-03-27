import { useState, useContext, useEffect } from 'react';
import { UserContext } from "../contexts/userContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Hero from '../components/Hero'
import Popular from '../components/Popular'
import Restaurant from '../components/Restaurant-near-you'
import IncomeTransaction from '../pages/IncomeTransaction';
import Aos from "aos";
import "aos/dist/aos.css";


function Landing() {
    useEffect(() => {
        Aos.init({ duration: 800 });
    }, []);
    const [state, dispatch] = useContext(UserContext);

    if (state.isLogin && state.user.role == 'PARTNER') {
        return (
            <div className="mb-5">
                <IncomeTransaction />
            </div>
        );
    } else {
        return (
            <div className="mb-5">
                <div className="bg-yellow pb-3">
                    <Hero />
                </div>
                <Popular />
                <Restaurant />
            </div>
        );
    }

}

export default Landing;
