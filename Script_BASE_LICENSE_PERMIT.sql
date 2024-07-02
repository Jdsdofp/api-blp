/**

CRIANDO A EMPRESA
aqui iniciamos a empresa que será dona de toda a hierarquia do projeto
que estara regido entre filiais e itens

**/

create table empresa(
	e_id serial4 primary key not null,
	e_nome varchar(255) not null,
	e_razao varchar(255) not null,
	e_cnpj char(20) not null,
	e_cidade varchar(180) not null,
	e_uf varchar(2) not null,
	criado_em TIMESTAMP default NOW()
)


/*
 * AQUI ALTEREI O TIMPO PARA TIMETZ
alter table empresa
alter column criado_em type TIMESTAMPTZ;
*/


--CRIANDO A PRIMEIRA EMPRESA
insert into empresa(e_nome,e_razao,e_cnpj,e_cidade,e_uf) values('Empreendimentos Farmaceuticos Globo Ltda', 'Drogaria Globo', '63503007000146', 'Teresina', 'PI');


--CRIANDO A TABELA USUARIO
/*
O usuário pode ter relação com varias tabelas desde a empresa quanto a filial e processos
*/
create table usuario(
	u_id serial4 primary key not null,
	u_nome varchar(180) not null,
	u_email varchar(180) not null,
	u_senha varchar not null,
	criado_em TIMESTAMPTZ default now()
);

/*
 
AQUI FIZ A ALTERAÇÃO DAS COLUNAS 

alter table usuario
add column criado_em TIMESTAMPTZ;

alter table usuario
alter column criado_em set default now();

*/

--CRIANDO O PRIMEIRO USUARIO
insert into usuario(u_nome,u_email,u_senha) values('adm', 'adm@email.com', '123456');


--CRIANDO A TABELA FILIAL

create table filial(
	f_id serial4 primary key not null,
	f_nome varchar(255) not null,
	f_cnpj char(20) not null,
	f_cidade varchar(180) not null,
	f_uf varchar(2) not null,
	f_responsavel_id int,
	foreign key (f_responsavel_id) references usuario(u_id),
	f_empresa_id int not null,
	foreign key (f_empresa_id) references empresa(e_id)
);
/*


AQUI FIZ A INCLUSÃO DA COLUNA DE CRIAÇÃO
alter table filial
add column criado_em TIMESTAMPTZ;

alter table filial 
alter column criado_em set default now(); 

alter table filial
alter column f_responsavel_id set not null;
*/


--CRIAÇAO DA TABELA CONDICIONANTES
/*
Essa tabela trata de criar condições para emissão dos documentos
*/
create table condicionates(
	c_id serial4 primary key not null,
	c_tipo varchar not null,
	c_condicao JSONB,
	criado_em TIMESTAMPTZ default now()
);


--CRIAÇÃO DA TABELA TIPO DOCUMENTOS
create table tipo_documento(
	td_id serial4 primary key not null,
	td_desc varchar unique not null
);

alter table tipo_documento
add column criado_em TIMESTAMPTZ;

alter table tipo_documento
alter column criado_em set default now(); 



--CRIAÇÃO DA TABELA DOCUMENTOS
/*
 tabela de documentos
*/
create table documentos(
	d_id serial4 primary key not null,
	d_filial_id int not null,
	foreign key (d_filial_id) references filial(f_id),
	d_data_pedido date not null,
	d_data_emissao date not null,
	d_data_vencimento date not null,
	d_tipo_doc_id int,
	foreign key (d_tipo_doc_id) references tipo_documento(td_id),
	d_orgao_exp varchar not null,
	d_anexo varchar,
	d_criador_id int,
	d_comentarios JSONB
);

/*
alter table documentos
add column criado_em TIMESTAMPTZ;

alter table documentos
alter column criado_em set default now();

alter table documentos
add column d_criador_id int not null;

alter table documentos
add foreign key (d_criador_id) references usuario(u_id);

*/

alter table documentos
add column d_comentarios JSONB;










































