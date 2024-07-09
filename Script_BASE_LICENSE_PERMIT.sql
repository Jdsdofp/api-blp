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
	criado_em TIMESTAMP default NOW(),
	e_ativo boolean default true
);

---TRIGGER PARA FUNÇÃO atualiza_filial_ativo()
create trigger trigger_atualiza_filial_ativo
after update on empresa
for each row 
execute function atualiza_filial_ativo();



/*
 * AQUI ALTEREI O TIMPO PARA TIMETZ
alter table empresa
alter column criado_em type TIMESTAMPTZ;

alter table empresa
add column e_ativo boolean default true;
*/


--CRIANDO A TABELA USUARIO
/*
O usuário pode ter relação com varias tabelas desde a empresa quanto a filial e processos
*/
create table usuario(
	u_id serial4 primary key not null,
	u_nome varchar(180) not null,
	u_email varchar(180) not null unique,
	u_senha varchar not null,
	criado_em TIMESTAMPTZ default now(),
	u_ativo boolean default true
);


alter table usuario
add column 


/*
 
AQUI FIZ A ALTERAÇÃO DAS COLUNAS 

alter table usuario
add column criado_em TIMESTAMPTZ;

alter table usuario
alter column criado_em set default now();

alter table usuario
add constraint unique_u_email UNIQUE(u_email);

alter table usuario
add column u_ativo boolean default true;

*/


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
	foreign key (f_empresa_id) references empresa(e_id),
	f_ativo boolean default true
);



---TRIGGER PARA FUNÇÃO atualiza_documentos_ativo()
create trigger trigger_atualiza_documentos_ativo
after update on filial
for each row 
execute function atualiza_documentos_ativo();


--FUNÇÃO PARA A TRIGGER PARA DESATIVAR FILIAL....
create or replace function atualiza_filial_ativo()
returns trigger as $$
begin
	update filial 
	set f_ativo = new.e_ativo
	where f_empresa_id = new.e_id;
	return new;
end;
$$ language plpgsql;



/*


AQUI FIZ A INCLUSÃO DA COLUNA DE CRIAÇÃO
alter table filial
add column criado_em TIMESTAMPTZ;

alter table filial 
alter column criado_em set default now(); 

alter table filial
alter column f_responsavel_id set not null;

alter table filial
add column f_ativo boolean default true;
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
	td_desc varchar unique not null,
	criado_em TIMESTAMPTZ default now()
);

/*
alter table tipo_documento
add column criado_em TIMESTAMPTZ;

alter table tipo_documento
alter column criado_em set default now(); 
*/


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
	d_tipo_doc_id int not null,
	foreign key (d_tipo_doc_id) references tipo_documento(td_id),
	d_orgao_exp varchar not null,
	d_anexo varchar,
	d_criador_id int,
	d_comentarios JSONB default '[]',
	d_ativo boolean default true,
	d_num_protocolo varchar unique
);

--FUNÇÃO PARA A TRIGGER PARA DESATIVAR DOCUMENTOS....
create or replace function atualiza_documentos_ativo()
returns trigger as $$
begin
	update documentos
	set d_ativo = new.f_ativo
	where d_filial_id = new.f_id;
	return new;
end;
$$ language plpgsql;



/*
alter table documentos
add column criado_em TIMESTAMPTZ;

alter table documentos
alter column criado_em set default now();

alter table documentos
add column d_criador_id int not null;

alter table documentos
add foreign key (d_criador_id) references usuario(u_id);

alter table documentos
add column d_comentarios JSONB;

alter table documentos
alter column d_comentarios set default '[]';

alter table documentos
alter column d_tipo_doc_id set not null;

alter table documentos
add column d_ativo boolean default true;

alter table documentos
add column d_num_protocolo varchar unique;
*/


create table comentarios_documentos(
	cd_id serial4 primary key not null,
	cd_documento_id integer not null,
	foreign key (cd_documento_id) references documentos(d_id),
	cd_autor_id integer not null,
	foreign key (cd_autor_id) references usuario(u_id),
	cd_msg text,
	cd_resposta JSONB,
	criado_em TIMESTAMPTZ default now()
);


--FUNÇÃO PARA TRATAR COMENTARIOS DOS DOCUMENTOS
/* 
 Esse comentarios são de extrema importancia para ter registros
 de como anda o processo por meio dos executores 
 
 +++toda vez que for criado um comentario referente ao um determinado documento
 no campo d_comentario sera adicionando o id do referido comentario
 e na tabela comentarios_documentos
 
  */

create or replace function atualiza_d_comentarios()
returns trigger as $$
begin 
	update documentos
	set d_documento = (
	
	select jsonb_agg(cd_id)
		from comentarios_documentos
	where cd_documento_id = NEW.cd_documento_id
	
	)
	where d_id = NEW.cd_documento_id;
	
	return NEW;
end;

$$ language plpgsql;

---TRIGGER PARA INSERIR OS IDS NA TABELA DOCUMENTOS
create trigger comentarios_inserir_trigger
after insert on comentarios_documentos
for each row
execute function atualiza_d_comentarios();



/*
 Função que trata o delete dos ids na tabela documentos se algum comentario for excluso */

create or replace function delete_d_comentarios()
returns trigger as $$
begin 
	update documentos
	set d_documento = (
		
		select jsonb_agg(cd_id)
			from comentarios_documentos
		where cd_documento_id = old.cd_documento_id
	)
	
	where d_id = old.cd_documentos_id;

	return old;
end;

$$ language plpgsql;


create trigger comentarios_delete_trigger
after delete on comentarios_documentos
for each row 
execute function delete_d_comentarios();



