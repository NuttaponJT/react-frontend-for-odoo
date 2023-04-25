import { Button } from 'react-bootstrap';

function PushEventMain() {

  return (
    <>
        <div class="content-wrap">
          <h1>Push Event</h1>
        </div>
        <div class="content-wrap">
          <h3>Message to push</h3>
          <div class="content-wrap">
            <textarea class="text-area-style" id="message-to-push" placeholder="Type your message to push here . . ."/>
            <Button variant="outline-success">Success</Button>{' '}
          </div>
        </div>
    </>
  );
}

export default PushEventMain;
  