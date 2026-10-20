import React, { useEffect, useState } from 'react';

interface Props { onFinish: () => void; }
export const AppLuxurySplash: React.FC<Props> = ({ onFinish }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduce);
    const timer = window.setTimeout(onFinish, reduce ? 300 : 2300);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="hv-launch" role="status" aria-label="Opening HAKKIVEDA">
      <style>{`
        .hv-launch{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(ellipse at 50% 45%,#164c32 0%,#092b1e 48%,#03170f 100%);color:#f9e7b3}
        .hv-launch:before{content:"";position:absolute;inset:-20%;background:radial-gradient(ellipse at 20% 20%,rgba(94,148,50,.25),transparent 30%),radial-gradient(ellipse at 85% 85%,rgba(167,113,30,.2),transparent 35%);animation:hvBreathe 3s ease-in-out infinite alternate}
        .hv-launch-leaf{position:absolute;width:130px;height:70px;border-radius:100% 0 100% 0;background:linear-gradient(135deg,#1b6833,#0a2f1c 60%,#4e8e39);box-shadow:inset 1px 1px 15px #8ac26355,0 8px 35px #0008;opacity:.65;animation:hvLeafFloat 3.2s ease-in-out infinite alternate}
        .hv-launch-leaf.one{top:12%;left:-55px;transform:rotate(-30deg)}.hv-launch-leaf.two{right:-65px;top:23%;animation-delay:-1s;transform:rotate(125deg)}.hv-launch-leaf.three{bottom:12%;left:-40px;animation-delay:-1.8s;transform:rotate(30deg)}
        .hv-launch-center{position:relative;display:flex;flex-direction:column;align-items:center;width:min(85vw,380px);margin-top:-8vh}
        .hv-launch-ring{position:absolute;top:-32px;width:min(74vw,320px);height:min(74vw,320px);border-radius:50%;border:1px solid #d9ae5480;box-shadow:0 0 32px #ffbf4c40,inset 0 0 20px #ffbf4c15;animation:hvRing 1.8s ease-out both}
        .hv-launch-ring:after{content:"";position:absolute;inset:-2px;border-radius:50%;border:3px solid transparent;border-top-color:#ffe8a1;border-right-color:#d9a53c;filter:drop-shadow(0 0 10px #ffc35e);animation:hvOrbit 1.9s linear infinite}
        .hv-launch-logo{position:relative;width:min(66vw,275px);height:auto;object-fit:contain;filter:drop-shadow(0 6px 16px #f8b94350);animation:hvLogoReveal 1.35s cubic-bezier(.2,.8,.2,1) both}
        .hv-launch-title{font-family:Georgia,serif;font-size:clamp(28px,8vw,39px);letter-spacing:.09em;color:#f4d488;text-shadow:0 2px 20px #d5a84b70;margin-top:18px;animation:hvWords 1.2s .7s both}
        .hv-launch-tag{font-size:10px;letter-spacing:.2em;color:#e9d9a8;margin-top:10px;animation:hvWords 1s 1.05s both}
        .hv-launch-pool{position:absolute;bottom:14%;width:230px;height:38px;border-radius:50%;border:2px solid #f7c85e55;box-shadow:0 0 30px #e5a82d80,inset 0 0 20px #e5a82d70;animation:hvPool 2s ease-in-out infinite}
        @keyframes hvOrbit{to{transform:rotate(360deg)}}@keyframes hvLogoReveal{from{opacity:0;transform:translateY(25px) scale(.75);filter:blur(9px)}to{opacity:1;transform:none;filter:drop-shadow(0 6px 16px #f8b94350)}}@keyframes hvRing{from{opacity:0;transform:scale(.65)}to{opacity:1;transform:scale(1)}}@keyframes hvWords{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:none}}@keyframes hvBreathe{to{transform:scale(1.1)}}@keyframes hvLeafFloat{to{translate:0 -30px;opacity:.9}}@keyframes hvPool{50%{transform:scaleX(1.2);opacity:.5}}
        @media(prefers-reduced-motion:reduce){.hv-launch *,.hv-launch:before{animation:none!important}}
      `}</style>
      {!reducedMotion && <><div className="hv-launch-leaf one"/><div className="hv-launch-leaf two"/><div className="hv-launch-leaf three"/></>}
      <div className="hv-launch-center"><div className="hv-launch-ring"/><img className="hv-launch-logo" src="/hakkiveda-brand/splash-monogram.png" alt="HAKKIVEDA HV logo"/><div className="hv-launch-title">HAKKIVEDA</div><div className="hv-launch-tag">NATURAL CARE · REAL RESULTS</div></div>
      <div className="hv-launch-pool"/>
    </div>
  );
};
