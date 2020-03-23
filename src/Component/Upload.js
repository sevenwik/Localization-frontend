import React,{ Fragment} from 'react'
import axios from 'axios';
import './Upload.css';
import { Button} from 'react-bootstrap';
import { withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import 'bootstrap/dist/css/bootstrap.min.css';

var selectedFileName = null;
var fileName = "Choose Files";

const port = 'https://safe-plateau-56340.herokuapp.com/';

const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);

export default class Upload extends React.Component{
    
    constructor(props){

        super(props);
        this.state={
            selectedFile: null,
            selectedFileName:null,
            data:[],
        }
        this.renderTableData = this.renderTableData.bind(this);

    }
    onChange = e => {
        this.setState({
            selectedFile: e.target.files[0],
            selectedFileName: e.target.files[0].name,
            fileName:selectedFileName,
           })
           //console.log(fileName)
    }  
    onSubmit = async e =>{
        e.preventDefault();
        const data = new FormData()
        data.append('file', this.state.selectedFile)
            await axios(port+'upload',{method:'POST',data,withCredentials:true
        }).then(res=>{
                this.setState({
                    data:res.data,
                })
                //console.log(this.state.data);
            })
            console.log(data);
    };
    onDownload = (e)=>{

        console.log(e.target.value)
        let data = this.state.data.find(d=>{
          return d.language === e.target.value;
        })
        const filename = data.language;
        delete data['language']
        if(this.state.id!=null && this.state.value!=null)
        {
          data[this.state.id] = this.state.value;
        }
        const json_data = JSON.stringify(data);
        const blob = new Blob([json_data], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = filename + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
      }
      changeText(e)
      {
        this.setState({id:e.target.id});
        this.setState({value:e.target.value});
       
      }
    renderTableData(){
        return this.state.data.map((applicant,index)=>{
          const {language,application,applicant_details,applicant_name,aadhar_number,mobile_number,email} = applicant;
          return(
            <StyledTableRow key={language}>
              <td>{language}</td>
              <StyledTableCell><input type="text" value={application} id="application" onChange={(e)=>{this.changeText(e)}}/></StyledTableCell>
              <StyledTableCell><input type="text" value={applicant_details} id="applicant_details" onChange={(e)=>{this.changeText(e)}}/></StyledTableCell>
              <StyledTableCell><input type="text" value={applicant_name} id="applicant_name" onChange={(e)=>{this.changeText(e)}}/></StyledTableCell>
              <StyledTableCell><input type="text" value={aadhar_number} id="aadhar_number" onChange={(e)=>{this.changeText(e)}}/></StyledTableCell>
              <StyledTableCell><input type="text" value={mobile_number} id="mobile_number" onChange={(e)=>{this.changeText(e)}}/></StyledTableCell>
              <StyledTableCell><input type="text" value={email} id ="email" onChange={(e)=>{this.changeText(e)}}/></StyledTableCell>
              <StyledTableCell><Button variant="dark" value={language} id={language} key={language} onClick={(e)=>{this.onDownload(e)}}>Download</Button></StyledTableCell>
            </StyledTableRow>
          )
        })
      }
    
      renderTableHeader(){
        var keys = Object.keys(this.state.data[0])
        console.log(keys)
      }
    
    render(){
    return (
       <Fragment>
           <form onSubmit={this.onSubmit}>
           <div className="custom-file mb-4">
                <input type="file" className="custom-file-input" id="customFile" multiple onChange={this.onChange}/>
                <label className="custom-file-label" htmlFor="customFile">
                    {fileName}
                </label>
            </div>
            <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4"></input>
           </form>
           <br></br>
            <div>
            {this.state.data.length!==0 ?  (
            <TableContainer component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                  <StyledTableCell>Language</StyledTableCell>
                  <StyledTableCell>Application</StyledTableCell>
                  <StyledTableCell>Application_details</StyledTableCell>
                  <StyledTableCell>Applicant_name</StyledTableCell>
                  <StyledTableCell>Aadhar_number</StyledTableCell>
                  <StyledTableCell>Mobile_number</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Download</StyledTableCell>
                  </TableRow>              
                </TableHead>
                <TableBody>
                  {this.renderTableData()}
                </TableBody>
              </Table>
              </TableContainer>
            ):null
            }
           </div>
       </Fragment>
    )
}
}
