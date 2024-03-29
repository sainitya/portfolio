import React, { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import Fade from 'react-reveal/Fade';
import endpoints from '../constants/endpoints';
import Social from './Social';
import FallbackSpinner from './FallbackSpinner';
import PropTypes from 'prop-types';
import Header from './Header';
import { Container, Col, Row, Card } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

const styles = {
  nameStyle: {
    fontSize: '2.0em',
  },
  inlineChild: {
    display: 'inline-block',
    fontSize: '1.2em',
    fontWeight: '500'
  },

  mainContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  introTextContainer: {
   // margin: 10,
    flexDirection: 'column',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    fontSize: '1em',
    // fontWeight: 500,
  },
  introTextHeader: {
    textAlign:'left',
  },
  introTextMeetingMessage: {
    textAlign:'left',
    marginTop: '20px'
  },
  introImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  introTextHeader: {
    flexDirection: 'column',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    fontSize: '1.5em',
    fontWeight: 'bold'
  },
  cardContainer: {
    margin: '20px auto', // Adjust margin as needed
   // maxWidth: '400px', // Adjust max width as needed
  },
  typeWriterText: {
    fontSize: 'x-large',
    color:'#606008'
  }
};

function About(props) {
  const { header } = props;
  const [data, setData] = useState(null);

  const parseIntro = (text) => (
    <ReactMarkdown children={text} />
  );

  useEffect(() => {
    fetch(endpoints.about, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <>
      {/* <Header title={header} /> */}
      <Container style={styles.cardContainer}>
      <Card style={{ boxShadow: '8px 4px 12px 7px rgb(10 9 9 / 10%)' }}>
          <Card.Body>
            {data ? (
              <Fade>
                <Row>
                  <Col style={styles.introImageContainer}>
                    <img src={data?.imageSource} alt="profile" />
                  </Col>
                
                <div style={styles.mainContainer}>
                 <span style={styles.nameStyle}>{data?.name}</span>
                  <div style={{ flexDirection: 'row', ...styles.typeWriterText }}>
                    {/* <span style={styles.inlineChild}>I&apos;m&nbsp;</span> */}
                    <Typewriter
                      options={{
                        loop: true,
                        autoStart: true,
                        strings: data?.roles,

                      }}
                    />
                  </div>
                  <Social />
                </div>
                </Row>
              </Fade>
            ) : (
              <FallbackSpinner />
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}


function Home(props) {

  const { header } = props;
  const [data, setData] = useState(null);
  const [formattedMeetingMessage,setFormattedMeetingMessage] = useState('');

  const parseIntro = (text) => (
    <ReactMarkdown children={text} />
  );

  useEffect(() => {
    fetch(endpoints.home, {
      method: 'GET',
    })
    .then((res) => res.json())
    .then((res) => {
      setData(res);
      if (res && res.meetingMessage) {
        const meetingMessageWithCalendly = res.meetingMessage.replace(
          "$calendy",
          `<a href='' style="color: rgb(96, 96, 8);" onclick='Calendly.initPopupWidget({url: "https://calendly.com/snbector/30min"}); return false;'>Schedule a quick virtual meeting with me</a>`
        )
        .replace("$portfolio",`<a href='/projects' style="color: rgb(96, 96, 8);">portfolio</a>`)
        .replace("$skills",`<a href='/skills' style="color: rgb(96, 96, 8);">Skills</a>`);
        setFormattedMeetingMessage(meetingMessageWithCalendly);
      }
    })
    .catch((err) => err);
}, []);


  return data ? (
    <Fade>
      <Container style={styles.cardContainer}>
      <Card style={{ boxShadow: '8px 4px 12px 7px rgb(10 9 9 / 40%)' }}>
          <Card.Body>
            <div className='row'>
              <div className='col-md-6'> 
                <About header={data.name} /> 
              </div>

              <div className='col-md-6' style={{ display: 'flex', flexDirection: 'column' }}> 
                <span style={styles.introTextHeader}> {parseIntro(data.header)}</span>
                <Col style={styles.introTextContainer}>
                  {parseIntro(data.about)}
                </Col>
                <Col style={{ ...styles.introTextContainer, marginTop: 'auto' }}>
                   <div dangerouslySetInnerHTML={{ __html: formattedMeetingMessage }} />
                </Col>
              </div>


            </div>
          </Card.Body>
        </Card>
      </Container>
    </Fade>
  ) : <FallbackSpinner />;
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Home;
