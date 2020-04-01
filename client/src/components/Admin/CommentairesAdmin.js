import React from "react";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import MUIDataTable from "mui-datatables";
import M from 'materialize-css';
import Cookies from 'universal-cookie'

export class CommentairesAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          allCommentaires : [],
          data: {columns:[], rows:[]}
          }
          this.getAllCommentaires = this.getAllCommentaires.bind(this)
          this.fillCommentairesDatatable = this.fillCommentairesDatatable.bind(this)
          this.getAllCommentaires();
    }

    getAllCommentaires = async() => {
        const callCommentaires = await API.getAllCommentaires();
        this.setState({allCommentaires : callCommentaires.data})
        const v = this.fillCommentairesDatatable()
        this.setState({data : v})
    }

    deleteCommentaire = (index) => {
      var array = this.state.data.rows
      let commentaireId = array[index][0]
      API.deleteCommentaire({"commentaireId" : commentaireId})
      M.toast({html: "Commentaire supprimé !" ,classes: "green"})
    }

    fillCommentairesDatatable = () => {
        const {allCommentaires} = this.state
        var cdata = {columns:[], rows: []}
        allCommentaires.map
        ( (commentaire) => 
          {
             cdata.rows.push([
                commentaire._id,
                commentaire.created_at,
                commentaire.propos ? commentaire.propos.contenu : "null",
                commentaire.contenu,
                commentaire.likes,
                commentaire.dislikes,
                commentaire.creator ? commentaire.creator.email : 'Anonyme'
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
        cookies.set('lastCommentairesAdminLoginDate', new Date(), {path: '/', expires: d})
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
              label: 'Commentaire',
              field: 'commentaire',
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
          const lastLogged = cookies.get('lastCommentairesAdminLoginDate')

          const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRowsOnClick : "true",
            onRowsDelete : (d) => d.data.map( (com) => { this.deleteCommentaire(com.dataIndex) }),
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
            <h2>Gérer les commentaires</h2>
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