import Link from 'next/link';

const LandingPage = ({ currentUser, tickets = [] }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      {tickets.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      ) : (
        <p>No tickets available.</p>
      )}
    </div>
  );
};

//server side
LandingPage.getInitialProps = async (context, client, currentUser) => {
  try {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
  } catch (err) {
    console.error('error fetching', error);

    return { tickets: [] };
  }
};

export default LandingPage;
