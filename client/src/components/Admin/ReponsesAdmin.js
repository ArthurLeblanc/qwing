import React from "react";
import ReactDOM from "react-dom";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import MUIDataTable from "mui-datatables";
import M from 'materialize-css';

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

    render() {
        const { data } = this.state;
        const columns= [
            {
              label: '#',
              field: 'id',
              sort: 'asc'
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
          const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRowsOnClick : "true",
            onRowsDelete : (d) => d.data.map( (reponse) => { this.deleteReponse(reponse.dataIndex) })
          };
        return (
        <div>
            <Header />
            <h2>Gérer les réponses</h2>
            <div className="divider"/>
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