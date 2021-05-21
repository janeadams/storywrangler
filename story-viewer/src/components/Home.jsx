import React from "react";
import {Link, withRouter} from "react-router-dom";
import {viewerOptions} from "../utils";
import {pageMeta} from "../defaults";
import ngram_tease from "./../img/teasers/ngram-tease.png"
import zipf_tease from "./../img/teasers/zipf-tease.png"
import realtime_tease from "./../img/teasers/realtime-tease.png"
import languages_tease from "./../img/teasers/languages-tease.png"
import rtd_tease from "./../img/teasers/rtd-tease.png"

function Home() {

    const teaserImgs = {
        'ngrams': ngram_tease,
        'zipf': zipf_tease,
        'realtime': realtime_tease,
        'languages': languages_tease,
        'rtd': rtd_tease
    }

    const viewerLinks = viewerOptions.map(v => {
        return (
            <Link to={`/${v}`}><div className="actionTeaser">
                <h2>{pageMeta(v).title}</h2>
                <img className="teaserImage" src={teaserImgs[v]}></img>
                <p>{pageMeta(v).desc}</p>
            </div></Link>
        )
    })

  return (
    <div className="home">
      <div className="container">
            <p className="landing-intro">
                A visual comparison of phrase popularity in 150 billion tweets. Read more <Link to="/about">here</Link>.
            </p>
          <div className="flexcontainer">
              {viewerLinks}
          </div>
      </div>
    </div>
  );
}

export default withRouter(Home);
