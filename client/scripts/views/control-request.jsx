import React from 'react';
import {PropTypes} from 'react';
import classname from 'classname';
import StackView from 'react-stack-view';

import fastTouch from '../utils/fast-touch';

import Actions from '../actions/nco-actions';
import MyListIndexStore from '../stores/mylist-index-store';

export default class ControlRequestView extends React.Component
{
    static propTypes = {
        // show: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    }

    constructor(props)
    {
        super(props);
        this.state = Object.assign({
            selectedListId: null,
            selectedMovieId: null,
        }, MyListIndexStore.getState().toJS());
    }

    componentDidMount() {
        this.disposers = {
            mylistIndexStore: MyListIndexStore.addListener(() => {
                this.setState(MyListIndexStore.getState().toJS());
            }),
        };
    }

    componentWillUnmount() {
        this.disposers.mylistIndexStore.remove();
    }

    onListSelected(listId, e) {
        e.preventDefault();
        this.setState({selectedListId: listId});
        Actions.ncoMylistItemsFetch(listId);
    }

    onMovieSelected(movieId, e) {
        if (this.state.selectedMovieId === movieId) {
            // TODO: Request
            console.log('movie requested');
            return;
        }

        this.setState({selectedMovieId: movieId});
    }

    render()
    {
        return (
            <div className={classname('NcoRequest', {show: true})}>
                <div className='Modal_header'>
                    <div accessKey='esc' className='Modal_header_closing fa fa-times' {...fastTouch(this.props.onClose)}></div>
                    <div className='Modal_header_title'>リクエスト</div>
                </div>

                {/*
                <h1>動画ID/URLからリクエスト</h1>
                <div className='flex NcoRequest_movie-id-input'>
                    <input ref='movieId' className='input' type='text'></input>
                    <button className='btn' type='button'>リクエスト</button>
                </div>
                */}

                <h1>マイリストからリクエスト</h1>
                <div className='NcoRequest_mylists'>
                    <ul className='NcoRequest_mylists_list'>
                    {this.state.lists.map(list =>
                        <li key={list.id} className={classname(
                            'NcoRequest_mylists_item',
                            {selected: this.state.selectedListId === list.id},
                        )} {...fastTouch(this.onListSelected.bind(this, list.id))}>
                            <div className='heading'>
                                <div accessKey='esc' className='Modal_header_closing fa fa-times' {...fastTouch(this.props.onClose)}></div>
                                <div className='Modal_header_title'>リクエスト > {list.name}</div>
                            </div>

                            {(() => this.state.selectedListId !== list.id ? null
                            : <ul key='movies' className='NcoRequest_movies'>
                                {(() => this.state.items.loading === false ? null : <div /> )()}
                                {(() => this.state.items.loading === true ? null : this.state.items[list.id].map(item =>
                                    (!item.movie || item.movie.isDeleted === true) ? null
                                    : <li
                                        key={`${list.id}-${item.id}`}
                                        className='NcoRequest_Movies_item'
                                        {...this.onMovieSelected.bind(this, item.movie.id)}>
                                        <img className='NcoRequest_movies_item_thumb' src={item.movie.thumbnail} />
                                        <span className='NcoRequest_movies_item_title'>{item.movie.title}</span>
                                    </li>
                                ))()}
                            </ul>
                            )()}
                        </li>
                    )}
                    </ul>
                </div>
            </div>
        );
    }
}
