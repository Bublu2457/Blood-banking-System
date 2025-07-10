import axios from 'axios';
function Main(){
  const handleSubmit = async (e) => {
    e.preventDefault();
    const city = e.target.city.value;

    try {
      const res = await axios.post(
        'http://localhost:8000/main',
        { city },
        { withCredentials: true } 
      );

      alert('Request sent successfully');
    } catch (err) {
      alert('Unauthorized or failed');
    }
  };
    return(
         <div id='mains'>
            <form onSubmit={handleSubmit}>
                <label for="cars">Choose a car:</label>
                <select name="city" id="city">
                  <option value="Hyderabad" name="Hyderabad">Hyderabad</option>
                  <option value="karimnaga" name="Karimnagar">Karimnagar</option>
                  <option value="siddipet" name="siddipet">Siddipet</option>
                  <option value="uppal" name="uppal">Uppal</option>      
                </select>
                <br></br>
                <input type="submit" value="Submit"/>
              </form>
        </div>
    )
}
export default Main;