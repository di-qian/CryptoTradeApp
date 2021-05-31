import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [newsdisplay, setNewsdisplay] = useState([]);
  useEffect(() => {
    setNewsdisplay(news);
  }, [news]);

  useEffect(() => {
    const jsonify = (res) => res.json();

    try {
      const getNews = async () => {
        await fetch(
          'https://api.tokendatabase.com/v1/news/posts?' +
            new URLSearchParams({
              start: '2021-05-21',
              end: '2021-05-21',
              limit: '10',
              key: process.env.REACT_APP_NEWS_APIKEY,
            })
        )
          .then(jsonify)
          .then((data) => {
            setNews(data.results);
          });
      };

      getNews();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const getNewsDate = (inDate) => {
    var date = new Date(inDate);

    const newsDate =
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : '0' + (date.getMonth() + 1)) +
      '/' +
      (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
      '/' +
      date.getFullYear();

    return newsDate;
  };

  const titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  };

  return (
    <>
      <h6 className="newstitle mb-3">Latest News</h6>

      <Col>
        {newsdisplay &&
          newsdisplay.map((newitem) => (
            <Row key={newitem.id} className="mb-4">
              <Col sm={12} md={12} lg={4}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`http://${newitem.url}`}
                >
                  <img
                    className="card-img mr-3"
                    src={newitem.thumbnail}
                    alt="Generic placeholder"
                  />
                </a>
              </Col>
              <Col sm={12} md={12} lg={8} className="ml-auto">
                <a
                  className="cardlink"
                  target="_blank"
                  rel="noreferrer"
                  href={`http://${newitem.url}`}
                >
                  <p className="cardtitle">{newitem.title}</p>
                </a>
                <div className="card_row">
                  <div>{getNewsDate(`${newitem.time}`)}</div>
                  <div className="card-separator">|</div>
                  <div className="card-author">
                    by {titleCase(`${newitem.author.name}`)}
                  </div>
                </div>
                <p className="card-text">{newitem.preview}</p>
              </Col>
            </Row>
          ))}
      </Col>
    </>
  );
};

export default NewsList;
