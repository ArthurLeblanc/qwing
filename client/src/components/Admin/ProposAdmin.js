import React from "react";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import MUIDataTable from "mui-datatables";
import M from 'materialize-css';
import Cookies from 'universal-cookie'

// Page de la gestion des propos de l'administration
export class ProposAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          allPropos : [],
          data:{columns:[], rows:[]},
          }
        this.getAllPropos = this.getAllPropos.bind(this)
        this.fillProposDatatable = this.fillProposDatatable.bind(this)
        this.getAllPropos();
    }
    
    // Récupère tous les propos et les met dans le state
    getAllPropos = async() => {
        const callPropos = await API.getAllPropos();
        this.setState({allPropos : callPropos.data});
        const v = this.fillProposDatatable()
        this.setState({data : v})
    }

    // Supprime le propos sélectionné dans la datatable
    deletePropos = (index) => {
        var array = this.state.data.rows
        let proposId = array[index][0]
        API.deletePropos({"proposId" : proposId})
        M.toast({html: "Propos supprimé !" ,classes: "green"})
    }

    // Formattage des données qui vont être utilisées dans la datatable
    fillProposDatatable = () => {
      const {allPropos} = this.state
        var cdata = {columns:[], rows: []}
        allPropos.map
        ( (propos) => 
          {
             cdata.rows.push([
                propos._id,
                propos.created_at,
                propos.contenu,
                propos.categorie.contenu,
                propos.likes,
                propos.creator ? propos.creator.email : 'Anonyme'
             ])
        })
        return cdata
    }

    // Création d'un cookie avec la date et heure actuelle juste avant le déchargement de la page
    componentDidMount() {
      window.addEventListener("beforeunload", (ev) => {  
        ev.preventDefault();
        const cookies = new Cookies()
        let d = new Date()
        // expire dans 3 ans
        d.setTime(d.getTime() + 100000000000)
        cookies.set('lastProposAdminLoginDate', new Date(), {path: '/', expires: d})
      });
    }

    render() {
        const { data } = this.state;
        const columns= [
            {
              label: 'id',
              field: 'id',
              options: {display: 'false'}
            },
            {
              label: 'Date de création',
              field: 'date',
              options: {sortDirection: 'desc'}
            },
            {
              label: 'Contenu',
              field: 'contenu'
            },
            {
              label: 'Catégorie',
              field: 'catégorie'
            },
            {
              label: 'Likes',
              field: 'likes'
            },
            {
              label: 'Creator',
              field: 'creator'
            }
          ];
          data.columns = columns
          // Récupère le cookie avec la date de dernier login
          const cookies = new Cookies()
          const lastLogged = cookies.get('lastProposAdminLoginDate')

          const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRowsOnClick : "true",
            onRowsDelete : (d) => d.data.map( (propos) => { this.deletePropos(propos.dataIndex) }),
            // Permet de changer la couleur des lignes de la datatable, rouge si le propos n'a pas encore été vu par l'admin, vert sinon
            setRowProps: (row) => {
              if (!lastLogged) { 
                return { 
                  style: { background: "lightCoral" } 
                } 
              } else {
                return {
                  style: { background: lastLogged < row[1] ?  "lightCoral" : "lightgreen" }
                }
              }
            }
          }
        return (
        <div>
            <Header />
            <h2>Gérer les propos</h2>
            <div className="divider" style={{marginTop: 30, marginBottom: 15}}/>
            <div className="container">
                <MUIDataTable
                    title={"Liste des propos"}
                    data={data.rows}
                    columns={data.columns}
                    options={options}
                />
            </div>
        </div>
        )
    }
}