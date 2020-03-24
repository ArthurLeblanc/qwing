import React from "react";
import ReactDOM from "react-dom";
import { Header } from "../Permanent/Header"
import API from "../../utils/API";
import MUIDataTable from "mui-datatables";
import M from 'materialize-css';

export class ProposAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          allPropos : [],
          data:{columns:[], rows:[]}
          }
        this.getAllPropos = this.getAllPropos.bind(this)
        this.fillProposDatatable = this.fillProposDatatable.bind(this)
        this.getAllPropos();
    }
    
    getAllPropos = async() => {
        const callPropos = await API.getAllPropos();
        this.setState({allPropos : callPropos.data});
        const v = this.fillProposDatatable()
        this.setState({data : v})
    }

    deletePropos = (index) => {
        var array = this.state.data.rows
        let proposId = array[index][0]
        API.deletePropos({"proposId" : proposId})
        M.toast({html: "Propos supprimé !" ,classes: "green"})
    }

    fillProposDatatable = () => {
      const {allPropos} = this.state
        var cdata = {columns:[], rows: []}
        allPropos.map
        ( (propos) => 
          {
             cdata.rows.push([
                propos._id,
                propos.contenu,
                propos.categorie.contenu,
                propos.likes,
                propos.creator ? propos.creator.email : 'Anonyme'
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
              label: 'Contenu',
              field: 'contenu',
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
              label: 'Creator',
              field: 'creator',
              sort: 'asc'
            }
          ];
          data.columns = columns
          const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRowsOnClick : "true",
            onRowsDelete : (d) => d.data.map( (propos) => { this.deletePropos(propos.dataIndex) })
          };
        return (
        <div>
            <Header />
            <h2>Gérer les propos</h2>
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