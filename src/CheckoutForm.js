import React, { Component } from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

class CheckoutForm extends Component {
    constructor(props) {
      super(props);
      this.state = {complete: "ready"}
      this.submit = this.submit.bind(this);
    }
  
    handleChange = event => {
        const {name,value} = event.target;

        this.setState({
            [name] : value
        });
    }

    getFormData = object => Object.keys(object).reduce((formData, key) => {
        formData.append(key, object[key]);
        return formData;
    }, new FormData());

    async submit(ev) {
        let {token} = await this.props.stripe.createToken({name : "Name"});

        let body = {
            token : token.id,
            name : this.state.name,
            email: this.state.email,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip
        }

        let response = await fetch("/charge", {
            method: "POST",
            headers: {},
            body: this.getFormData(body)
        });

        if (response.ok) this.setState({complete: "true"});
        else this.setState({complete: "false"});
    }
  
    render() {
        const {name, email, address, city, state, zip} = this.state

        if (this.state.complete === "true") return <h1>Purchase Complete</h1>;
        else if (this.state.complete ==="false") return <div><h1>Payment failed</h1><p>Refresh to try again.</p></div>;

        return (
            <div className="container">
                <form>
                    <p>Enter your the address you'd like your calendar to be shipped to, and an email address for any updates (we won't spam you).</p>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={this.handleChange}/>
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={this.handleChange}/>
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={this.handleChange}/>
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={city}
                        onChange={this.handleChange}/>
                    <label>State</label>
                    <input
                        type="text"
                        name="state"
                        value={state}
                        onChange={this.handleChange}/>
                    <label>Zip</label>
                    <input
                        type="text"
                        name="zip"
                        value={zip}
                        onChange={this.handleChange}/>
                </form>
                <p>Enter card details below. Card payments are processed by Stripe, and we don't see or store your card details.</p>
                <div className="checkout">
                    <CardElement />
                    <div className="vertical-centre, padding-top">
                        <button onClick={this.submit}>Purchase: $40.00 USD</button>
                    </div>
                </div>
                <p>We'll ship the calendar within two weeks of order. Shipping and tax are included in the price.</p>
            </div>
        );
    }
  }
  
  export default injectStripe(CheckoutForm);