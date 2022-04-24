# ddc-github

GitHub completion for ddc.vim via gh

These sources collect something related to GitHub (e.g. issues, pull requests)
via gh, which is GitHub’s official command line tool.

Now ddc-github provides below sources:

- `github_issue`
- `github_pull_request`

Please read [help](doc/ddc-github.txt) for details.

## Requirements

- [gh](https://github.com/cli/cli)
- [denops.vim](https://github.com/vim-denops/denops.vim)
- [ddc.vim](https://github.com/Shoguo/ddc.vim)

## Configuration

```vim
" Use github sources
call ddc#custom#patch_global('sources', ['github_issue', 'github_pull_request'])

" Change source options
call ddc#custom#patch_global('souceOptions', {
      \ 'github_issue': {
      \   'mark': 'issue',
      \   'forceCompletionPattern': '#\d*',
      \ },
      \ })

" Use on specific filetype
call ddc#custom#patch_filetype(['gitcommit'], {
      \ 'sources': ['github_issue', 'github_pull_request'],
      \ 'keywordPattern': '[a-zA-Z_:#]\k*',
      \ })

" Use on `gh (issue|pr) create` buffer
function! s:on_gh() abort
  " Check whether the file is gh's buffer
  let tmpdir = empty($TMPDIR) ? '/tmp' : expand('$TMPDIR')
  if fnamemodify(bufname(), ':h') != tmpdir || getcwd() == tmpdir
    return
  endif
  " Over sources
  call ddc#custom#patch_buffer({
        \ 'sources': ['github_issue', 'github_pull_request'],
        \ 'keywordPattern': '[a-zA-Z_:#]\k*',
        \ })
  inoremap <silent><expr><buffer> <C-x><C-g>
        \ ddc#map#manual_complete('github_issue', 'github_pull_request')
endfunction
autocmd FileType markdown call <SID>on_gh()
```
