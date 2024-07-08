import React from 'react';
import { useQuery, gql } from '@apollo/client';

function Hello(props) {

  var GET_HELLO = gql`
  query {
    getMatches(text: "${props.text}")
  }
  `;

  const { loading, error, data } = useQuery(GET_HELLO);

  if (loading) return <p>Loading...</p>;
  if (error) return <div>
                        <p>Error :(</p>
                        <p>{error.message}(</p>
                    </div>;
  return <div>
          {data.getMatches.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>;
}

export default Hello;