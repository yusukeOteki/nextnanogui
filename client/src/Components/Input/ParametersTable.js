import React from 'react';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Add from '@material-ui/icons/AddCircleOutline';
import Remove from '@material-ui/icons/RemoveCircleOutline';
import MenuItem from '@material-ui/core/MenuItem';

import { keywords } from '../../Functions/Params';

function createList(data) {
  let tempList = []
  for (let i = 0; i < data.length; i++) {
    Array.prototype.push.apply(tempList, data[i]);
  }
  return tempList;
}

function getSelected(data) {
  let tempSelected = [];
  for(let i = 0; i < data.length; i++){
    for(let j = 0; j < data[i].length; j++){
      data[i][j].selected && tempSelected.push(data[i][j].id);
    }
  }
  return tempSelected;
}
const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

/* Table Header */
class ParametersTableHead extends React.Component {
  render() {
    const { keyword } = this.props;
    const rows = [
      { id: 'name', label: `$${keyword}` },
      { id: 'parameters', label: 'Parameters' },
    ];
    const CustomTableCell = withStyles(theme => ({
      head: {
        backgroundColor: theme.palette.common.white,
        color: "red",
      },
      body: {
        fontSize: 14,
      },
    }))(TableCell);
    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <CustomTableCell key={row.id} >
                {row.label}
              </CustomTableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

ParametersTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
};


class TablePaginationActions extends React.Component {
  constructor(props){
    super(props);
    
    this.handleFirstPageButtonClick = this.handleFirstPageButtonClick.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
    this.handleLastPageButtonClick = this.handleLastPageButtonClick.bind(this);
  }

  handleFirstPageButtonClick (event)  {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick (event) {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick (event) {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick (event) {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="Remove Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);


/* Table */
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    //minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});
class ParametersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      maxPage: 0,
      rowsPerPage: Object.keys(keywords[props.data[0][0].keyword].properties).length,
    };
    //this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    
    this.handleAddPageButtonClick = this.handleAddPageButtonClick.bind(this);
    this.handleDeletePageButtonClick = this.handleDeletePageButtonClick.bind(this);
  }

/*   shouldComponentUpdate(nextProps, nextState) {
    //for(let key in nextProps){
    //  console.log(key, isEqual(nextProps[key], this.props[key]))
    //}
    const propsDiff = isEqual(nextProps, this.props);
    const stateDiff = isEqual(nextState, this.state);
    //console.log("propsDiff", propsDiff)
    //console.log("stateDiff", stateDiff)
    //console.log(!(propsDiff && stateDiff))
    return !(propsDiff && stateDiff);
    //return !stateDiff;
  } */

  handleClick (event, id) {
    const tempList = createList(this.props.data);
    tempList.map(item => {
      if (item.id === id) {
        if (!keywords[item.keyword].properties[item.name].required) {
          item.selected = !item.selected;
          this.props.onEventCallBack(item);
        }
      }
      return 0;
    })
  };

  handleChange (event, id) {
    const tempList = createList(this.props.data);
    tempList.map(item => {
      if (item.id === id) {
        item.value = event.target.value;
        this.props.onEventCallBack(item);
      }
      return 0;
    })
  };

  handleChangePage (event, page) {
    this.setState({ page });
  };

  handleChangeRowsPerPage (event) {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleAddPageButtonClick (event, data, page) {
    this.props.onEventCallBack(data[0].keyword, 'add');
    let maxPage = this.state.maxPage+1;
    this.setState({ page: maxPage, maxPage: maxPage });
  };

  handleDeletePageButtonClick (event, data, page) {
    let maxPage = this.state.maxPage ? this.state.maxPage-1 : 0;
    this.setState({ maxPage: maxPage });
    this.props.onEventCallBack({ keyword: data[0].keyword, page }, 'delete');
  };

  render() {
    const { classes, data } = this.props;
    const { rowsPerPage, page } = this.state;
    const list = createList(data);
    const selected = getSelected(data);
    const keyword = keywords[data[0][0].keyword].section;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, list.length - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <ParametersTableHead
              numSelected={selected.length}
              rowCount={list.length}
              keyword={keyword}
            />
            <TableBody>
              {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = n.selected;
                return (
                  <TableRow
                    hover={false}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={!isSelected}
                  >
                    <TableCell component="th" scope="row">{n.name}</TableCell>
                    <TableCell>
                      {typeof keywords[n.keyword].properties[n.name].choices === "object" && keywords[n.keyword].properties[n.name].choices !== null ?
                        <TextField
                          select
                          value={typeof n.value === 'object' ? n.value.join(' ') : n.value.toString()}
                          onChange={e => this.handleChange(e, n.id)}
                          SelectProps={{MenuProps: {className: classes.menu } }}
                        >
                          {keywords[n.keyword].properties[n.name].choices.map(option => (
                            <MenuItem key={option} value={typeof option === 'object' ? option.join(' ') : option.toString()}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField> :
                        <TextField
                          id="outlined-bare"
                          className={classes.textField}
                          value={typeof n.value === 'object' ? n.value.join(' ') : n.value.toString()}
                          variant="outlined"
                          onChange={event => this.handleChange(event, n.id)}
                        />
                      }
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} onClick={event => this.handleClick(event, n.id)} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {keywords[list[0].keyword].increment && (
              <TableFooter>
                <TableRow>
                  <TableCell padding={'none'}>
                    <IconButton onClick={(event) => this.handleDeletePageButtonClick(event, list, page)}> <Remove /> </IconButton>
                    <IconButton onClick={(event) => this.handleAddPageButtonClick(event, list, page)}> <Add /> </IconButton>
                  </TableCell>
                  <TablePagination
                    colSpan={3}
                    count={list.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    rowsPerPageOptions={[]}
                    ActionsComponent={TablePaginationActionsWrapped}
                  />
                  <TableCell padding={'none'}>
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </Paper>
    );
  }
}

ParametersTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParametersTable);
