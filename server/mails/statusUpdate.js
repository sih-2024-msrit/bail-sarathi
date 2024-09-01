const statusUpdate = (status, applicationNo, judgeLicense) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
	  <meta charset="UTF-8">
	  <title>Bail Reckoner - Application Status Update</title>
	  <style>
		body {
		  background-color: #fffff0;
		  font-family: Arial, sans-serif;
		  font-size: 16px;
		  line-height: 1.4;
		  color: #333333;
		  margin: 0;
		  padding: 0;
		}
	
		.container {
		  max-width: 600px;
		  margin: 0 auto;
		  padding: 20px;
		  text-align: center;
		}
	
		.logo {
		  max-width: 200px;
		  margin-bottom: 20px;
		}
	
		.message {
		  font-size: 24px;
		  font-weight: bold;
		  margin-bottom: 20px;
		  color: #FFD60A;
		}
	
		.body {
		  font-size: 16px;
		  margin-bottom: 20px;
		  text-align: left;
		}
	
		.cta {
		  display: inline-block;
		  padding: 10px 20px;
		  background-color: #FFD60A;
		  color: #000000;
		  text-decoration: none;
		  border-radius: 5px;
		  font-size: 16px;
		  font-weight: bold;
		  margin-top: 20px;
		}
	
		.support {
		  font-size: 14px;
		  color: #999999;
		  margin-top: 20px;
		}
	
		.highlight {
		  font-weight: bold;
		}
	  </style>
	
	</head>
	
	<body>
	  <div class="container">
			src="https://res.cloudinary.com/dcnhb3jwv/image/upload/v1725218729/m1tobcwfsdy5mnnszhmm.png" alt="Bail Reckoner Logo"></a>
		<div class="message">Bail Application Status Update</div>
		<div class="body">
		  <p>Dear User,</p>
		  <p>We are writing to inform you about the status of your bail application (Application No: <span class="highlight">${applicationNo}</span>).</p>
		  <p><strong>Status:</strong> ${status}</p>
		  <p>Your application has been reviewed by Judge (License No: <span class="highlight">${judgeLicense}</span>).</p>
		  <p>Please log in to your account to view more details and any further instructions regarding your application.</p>
		  <a href="https://bail-reckoner-url.com/login" class="cta">View Application Status</a>
		</div>
		<div class="support">If you have any questions or need assistance, please contact us at 
		  <a href="mailto:support@bailreckoner.com">support@bailreckoner.com</a>. We're here to help!</div>
	  </div>
	</body>
	
	</html>`;
  };
  
  module.exports = statusUpdate;
  