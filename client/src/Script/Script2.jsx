class Accueil extends React.Component {
	render() {
		return (
			<div>
				<h1> Accueil </h1>
				<h2> Description </h2>
				<p> Ce site est destiné à reccueillir toutes les remarques sexistes
				possibles que les utilisateurs entendent au quotidien, et y apporter
				des réponses pertinentes pour répondre et faire taire ceux qui sont
				adeptes de tels propos </p>
				< ProposList />
			</div>
			
		)
	}
}

class ProposList extends React.Component {
	render() {
		return (
			<div>
				<Propos />
			</div>
		)
	}
}

class Propos extends React.Component {
	render() {
		return (
			<div>
				<p>
				Titre : Montitrer
				/br
				Categorie : MaCategorie
				/br
				Descirption : MA Descirption blalbkpkokoazkdokapdkzaopkdazkdaop
				</p>
			</div>
		)
	}
}

class ContenuText extends React.Component {
	render () {
		return (
			<div>
				
			</div>
		)
	}
}

ReactDOM.render(<Accueil />, document.getElementById("root"))