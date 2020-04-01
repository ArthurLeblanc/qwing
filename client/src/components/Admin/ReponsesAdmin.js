import React from "react";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import MUIDataTable from "mui-datatables";
import M from 'materialize-css';
import Cookies from 'universal-cookie'

export class ReponsesAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          allReponses : [],
          data: {columns:[], rows:[]}
          }
        this.getAllReponses = this.getAllReponses.bind(this)
        this.fillReponsesDatatable = this.fillReponsesDatatable.bind(this)
        this.getAllReponses()
    }

    getAllReponses = async() => {
        const callReponses = await API.getAllReponses();
        this.setState({allReponses : callReponses.data})
        const v = this.fillReponsesDatatable()
        this.setState({data : v})
    }

    deleteReponse = (index) => {
        var array = this.state.data.rows
        let reponseId = array[index][0]
        API.deleteReponse({"reponseId" : reponseId})
        M.toast({html: "Propos supprimé !" ,classes: "green"})
    }

    fillReponsesDatatable = () => {
      const {allReponses} = this.state
        var cdata = {columns:[], rows: []}
        allReponses.map
        ( (reponse) => 
          {
             cdata.rows.push([
                reponse._id,
                reponse.created_at,
                reponse.propos ? reponse.propos.contenu : "null",
                reponse.contenu,
                reponse.categorie.contenu,
                reponse.likes,
                reponse.dislikes,
                reponse.creator ? reponse.creator.email : 'Anonyme',
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
        cookies.set('lastReponsesAdminLoginDate', new Date(), {path: '/', expires: d})
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
              label: 'Propos',
              field: 'propos',
              sort: 'asc'
            },
            {
              label: 'Réponse',
              field: 'reponse',
              sort: 'asc'
            },
            {
              label: 'Catégorie',
              field: 'catégorie',
              sort: 'asc'
            },
            {
              label: 'Likes',
              field: 'likes',
              sort: 'asc'
            },
            {
              label: 'Dislikes',
              field: 'dislikes',
              sort: 'asc'
            },
            {
              label: 'Creator',
              field: 'creator',
              sort: 'asc'
            },
            {
              label: 'Action',
              field: 'action',
            }
          ];
          data.columns = columns

          // Récupère le cookie avec la date de dernier login
          const cookies = new Cookies()
          const lastLogged = cookies.get('lastReponsesAdminLoginDate')

          const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRowsOnClick : "true",
            onRowsDelete : (d) => d.data.map( (reponse) => { this.deleteReponse(reponse.dataIndex) }),
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
          };
        return (
        <div>
            <Header />
            <h2>Gérer les réponses</h2>
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