import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade'; // Import Fade from react-reveal/Fade
import { Container } from 'react-bootstrap';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';

const styles = {
  iconStyle: {
    height: 75,
    width: 75,
    margin: 10,
    marginBottom: 0,
  },
  introTextContainer: {
    whiteSpace: 'pre-wrap',
  },
  // Define a new container style for grid layout
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Three columns
    gap: '20px', // Gap between grid items
  },
};

function Skills(props) {
  const { header } = props;
  const [data, setData] = useState(null);

  const renderSkillsIntro = (intro) => (
    <h4 style={styles.introTextContainer}>
      <ReactMarkdown children={intro} />
    </h4>
  );

  useEffect(() => {
    fetch(endpoints.skills, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <>
      <Header title={header} />
      {data ? (
        <Fade>
          <div className="section-content-container">
            <Container>
              {renderSkillsIntro(data.intro)}
              <div style={styles.gridContainer}>
                {data.skills?.map((rows) => (
                  <div key={rows.title}>
                    <br />
                    <h3>{rows.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {rows.items.map((item) => (
                        <div key={item.title} style={{ margin: '5px 10px' }}>
                          <img
                            style={styles.iconStyle}
                            src={item.icon}
                            alt={item.title}
                          />
                          <p>{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </Fade>
      ) : <FallbackSpinner /> }
    </>
  );
}

Skills.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Skills;
