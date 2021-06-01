import React from "react";
import storylablogo from "./../img/footer/storylab_white.svg"
import csclogo from "./../img/footer/csc.svg"
import mmlogo from "./../img/footer/mm_white.svg"

function Footer() {
  return (
    <div className="footer">
      <footer className="py-2 bg-dark fixed-bottom">
        <div className="container">
          <p className="m-0 text-center text-white">
            A research tool from:
              <a title="Computational Story Lab" href={'https://twitter.com/compstorylab'} target={'_blank'}><img className="footerLogo" src={storylablogo}></img></a>
              <a title="University of Vermont Complex Systems Center" href={'https://vermontcomplexsystems.org/'} target={'_blank'}><img className="footerLogo" src={csclogo}></img></a>
              <a title="MassMutual Center of Excellence" href={'https://vermontcomplexsystems.org/partner/MMCOE/'} target={'_blank'}><img id={'mm'} className="footerLogo" src={mmlogo}></img></a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
